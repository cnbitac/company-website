"""Loopback-only lead intake, SQLite outbox and SMTP notifications (stdlib only)."""
import hashlib
import json
import os
import re
import smtplib
import sqlite3
import ssl
import threading
import subprocess
import tempfile
import time
import uuid
from contextlib import contextmanager
from datetime import datetime, timezone
from email.message import EmailMessage
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
QUESTIONS = json.loads((ROOT / 'questions.json').read_text(encoding='utf-8'))
DB = os.environ.get('LEADS_DB', '/var/lib/linkedti-leads/leads.sqlite3')
CONFIG = os.environ.get('LEADS_CONFIG', '/etc/linkedti/leads.json')
ORIGIN = 'https://www.linkedti.com'
DIMENSIONS = ['equipmentValue', 'downtimeImpact', 'dataFoundation', 'teamCapability']
LABELS = {'immediate': '建议优先启动试点', 'pilot': '建议小范围试点', 'postpone': '建议先补基础', 'notNow': '现阶段暂不优先', 'pending': '信息待补充'}

@contextmanager
def connect():
    conn = sqlite3.connect(DB, timeout=15)
    conn.row_factory = sqlite3.Row
    try:
        with conn:
            yield conn
    finally:
        conn.close()

def initialize():
    Path(DB).parent.mkdir(parents=True, exist_ok=True)
    with connect() as c:
        c.execute('PRAGMA journal_mode=WAL')
        c.executescript('''CREATE TABLE IF NOT EXISTS leads (
          id TEXT PRIMARY KEY, request_id TEXT UNIQUE NOT NULL, payload_hash TEXT NOT NULL,
          created_at TEXT NOT NULL, contact_kind TEXT NOT NULL, contact TEXT NOT NULL,
          language TEXT NOT NULL, source TEXT NOT NULL, answers TEXT NOT NULL, result TEXT NOT NULL,
          consent_version TEXT NOT NULL, mail_status TEXT NOT NULL DEFAULT 'pending',
          attempts INTEGER NOT NULL DEFAULT 0, next_attempt REAL NOT NULL DEFAULT 0,
          delivered TEXT NOT NULL DEFAULT '[]', last_error TEXT, sent_at TEXT);
          CREATE TABLE IF NOT EXISTS intake_limits (ip_hash TEXT PRIMARY KEY, started REAL NOT NULL, count INTEGER NOT NULL);
        ''')

def score(answers):
    scores = {d: 0 for d in DIMENSIONS}
    known = {d: 0 for d in DIMENSIONS}
    for q in QUESTIONS:
        v = answers[q['id']]
        if v != 'unknown':
            scores[q['dimension']] += int(v)
            known[q['dimension']] += 1
    levels = {d: ('pending' if known[d] < 3 else 'high' if scores[d] >= 5 else 'medium' if scores[d] >= 3 else 'low') for d in DIMENSIONS}
    value, impact, data, team = (levels[d] for d in DIMENSIONS)
    if 'pending' in levels.values():
        result = 'pending'
    elif value == impact == 'low':
        result = 'notNow'
    elif value == impact == 'high' and data != 'low' and team != 'low':
        result = 'immediate'
    elif value == 'high' or impact == 'high':
        result = 'pilot'
    elif value == impact == 'medium':
        result = 'postpone' if data == 'low' or team == 'low' else 'pilot'
    else:
        result = 'postpone'
    return {'id': result, 'label': LABELS[result], 'scores': scores, 'levels': levels, 'version': 'waic-original-1'}

def validate(data):
    if not isinstance(data, dict) or data.get('consent') is not True or data.get('consentVersion') != '2026-09-17':
        raise ValueError('consent_required')
    if data.get('website', '') != '':
        raise ValueError('invalid_submission')
    answers = data.get('answers')
    ids = {q['id'] for q in QUESTIONS}
    if not isinstance(answers, dict) or set(answers) != ids or any(not isinstance(v, str) or v not in ('0', '1', '2', 'unknown') for v in answers.values()):
        raise ValueError('invalid_answers')
    kind, contact = data.get('contactKind'), data.get('contact')
    if not isinstance(contact, str) or re.search(r'[\x00-\x1f\x7f]', contact):
        raise ValueError('invalid_contact')
    contact = contact.strip()
    if kind == 'email':
        valid = len(contact) <= 160 and re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+', contact)
    elif kind == 'phone':
        valid = re.fullmatch(r'\+?[\d ()-]{7,24}', contact) and len(re.sub(r'\D', '', contact)) >= 7
    elif kind == 'wechat':
        valid = 2 <= len(contact) <= 80 and not re.search(r'\s', contact)
    else:
        valid = False
    if not valid:
        raise ValueError('invalid_contact')
    if data.get('language') not in ('zh', 'en', 'ja') or not re.fullmatch(r'[a-zA-Z0-9-]{16,80}', str(data.get('requestId', ''))):
        raise ValueError('invalid_request')
    return {'answers': answers, 'contactKind': kind, 'contact': contact, 'language': data['language'], 'source': 'website/contact', 'consentVersion': '2026-09-17'}

def save(data, ip):
    clean = validate(data)
    payload_hash = hashlib.sha256(json.dumps(clean, sort_keys=True).encode()).hexdigest()
    request_id = data['requestId']
    with connect() as c:
        c.execute('BEGIN IMMEDIATE')
        existing = c.execute('SELECT id, payload_hash FROM leads WHERE request_id=?', (request_id,)).fetchone()
        if existing:
            if existing['payload_hash'] != payload_hash:
                raise ValueError('request_conflict')
            return existing['id'], True
        now = time.time()
        # Persistent hourly rate limit; never store raw IP addresses.
        bucket = hashlib.sha256((ip + datetime.now(timezone.utc).strftime('%Y-%m-%d')).encode()).hexdigest()
        c.execute('DELETE FROM intake_limits WHERE started < ?', (now - 3600,))
        count = c.execute('SELECT count FROM intake_limits WHERE ip_hash=?', (bucket,)).fetchone()
        if count and count[0] >= 10:
            raise ValueError('rate_limited')
        c.execute('INSERT INTO intake_limits VALUES (?, ?, 1) ON CONFLICT(ip_hash) DO UPDATE SET count=count+1', (bucket, now))
        lead_id = str(uuid.uuid4())
        c.execute('INSERT INTO leads (id,request_id,payload_hash,created_at,contact_kind,contact,language,source,answers,result,consent_version) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
                  (lead_id, request_id, payload_hash, datetime.now(timezone.utc).isoformat(), clean['contactKind'], clean['contact'], clean['language'], clean['source'], json.dumps(clean['answers']), json.dumps(score(clean['answers']), ensure_ascii=False), clean['consentVersion']))
        return lead_id, False

def mail_config():
    try:
        return json.loads(Path(CONFIG).read_text(encoding='utf-8'))
    except (OSError, ValueError):
        return {}

def build_message(row, cfg):
    result, answers = json.loads(row['result']), json.loads(row['answers'])
    msg = EmailMessage()
    msg['Subject'] = '[官网应用评估] ' + result['label'] + ' · ' + row['id'][:8]
    msg['From'], msg['To'] = cfg['user'], ', '.join(cfg['to'])
    msg['Cc'] = ', '.join(cfg['cc'])
    msg['Message-ID'] = '<lead-' + row['id'] + '@linkedti.com>'
    if row['contact_kind'] == 'email':
        msg['Reply-To'] = row['contact']
    text = ['官网收到新的设备预测性维护评估。', '线索编号：' + row['id'], '提交时间（UTC）：' + row['created_at'], '联系渠道：' + row['contact_kind'], '联系方式：' + row['contact'], '页面语言：' + row['language'], '评估结论：' + result['label'], '联系授权：用户主动勾选同意；版本 ' + row['consent_version'], '', '四维结果：']
    text += [d + ': ' + result['levels'][d] + ' (' + str(result['scores'][d]) + '/6；未知维度不评级)' for d in DIMENSIONS]
    text += ['', '完整回答：']
    for q in QUESTIONS:
        value = answers[q['id']]
        label = next((o['label'] for o in q['options'] if str(o['value']) == value), '暂不清楚')
        text += [q['title'], '  ' + label]
    text += ['', '本评估是项目适用性自评，不是设备健康或安全诊断。线索已保存至网站后台。']
    msg.set_content('\n'.join(text))
    return msg

def deliver_once():
    cfg = mail_config()
    provider = cfg.get('provider', 'smtp')
    required = ('user', 'to', 'cc') if provider == 'agently' else ('host', 'user', 'password', 'to', 'cc')
    if not all(cfg.get(k) for k in required):
        return
    with connect() as c:
        rows = c.execute("SELECT * FROM leads WHERE mail_status IN ('pending','retry') AND next_attempt <= ? ORDER BY created_at LIMIT 5", (time.time(),)).fetchall()
    for row in rows:
        if provider == 'agently':
            deliver_agently(row, cfg)
            continue
        delivered = set(json.loads(row['delivered']))
        recipients = set(cfg['to'] + cfg['cc']) - delivered
        error = None
        try:
            if recipients:
                with smtplib.SMTP_SSL(cfg['host'], int(cfg.get('port', 465)), timeout=20, context=ssl.create_default_context()) as smtp:
                    smtp.login(cfg['user'], cfg['password'])
                    refused = smtp.send_message(build_message(row, cfg), from_addr=cfg['user'], to_addrs=sorted(recipients))
                    delivered.update(recipients - set(refused))
                    if refused:
                        error = 'recipient_refused'
        except (smtplib.SMTPException, OSError, ValueError) as exc:
            # Log only class, never response bodies, credentials or contact details.
            error = type(exc).__name__
        sent = not error
        with connect() as c:
            c.execute('UPDATE leads SET mail_status=?,delivered=?,attempts=attempts+1,next_attempt=?,last_error=?,sent_at=? WHERE id=?',
                      ('sent' if sent else 'retry', json.dumps(sorted(delivered)), time.time() + min(3600, 60 * (2 ** min(row['attempts'], 6))), error, datetime.now(timezone.utc).isoformat() if sent else None, row['id']))

def deliver_agently(row, cfg):
    msg = build_message(row, cfg)
    status, error, sent_at = 'retry', None, None
    delay = min(3600, 60 * (2 ** min(row['attempts'], 6)))
    try:
        with tempfile.TemporaryDirectory(prefix='linkedti-mail-') as directory:
            body = Path(directory) / 'body.txt'
            body.write_text(msg.get_content(), encoding='utf-8')
            body.chmod(0o600)
            command = ['/usr/local/bin/agently-cli', 'message', '+send', '--subject', str(msg['Subject']), '--body-file', './body.txt', '--body-format', 'plain', '--confirmed']
            for address in cfg['to']:
                command += ['--to', address]
            for address in cfg['cc']:
                command += ['--cc', address]
            response = subprocess.run(command, cwd=directory, capture_output=True, text=True, timeout=90)
            try:
                envelope = json.loads(response.stdout)
            except ValueError:
                envelope = {}
            if response.returncode == 0 and envelope.get('ok') is True:
                status = 'sent'
                sent_at = datetime.now(timezone.utc).isoformat()
            else:
                error = 'agently_exit_' + str(response.returncode)
                if response.returncode in (2, 3, 6, 8) or (response.returncode in (1, 4) and row['attempts'] >= 2):
                    status = 'blocked'
                if response.returncode == 7:
                    delay = 3600
    except (OSError, subprocess.TimeoutExpired):
        error = 'agently_execution_error'
        if row['attempts'] >= 2:
            status = 'blocked'
    with connect() as c:
        c.execute('UPDATE leads SET mail_status=?,attempts=attempts+1,next_attempt=?,last_error=?,sent_at=? WHERE id=?',
                  (status, time.time() + delay, error, sent_at, row['id']))

def worker():
    while True:
        try:
            deliver_once()
        except Exception as exc:
            print('outbox_error:' + type(exc).__name__, flush=True)
        time.sleep(30)

class Handler(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def respond(self, status, data):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        self.respond(200 if self.path == '/api/health' else 404, {'ok': self.path == '/api/health'})

    def do_POST(self):
        if self.path != '/api/leads':
            return self.respond(404, {'error': 'not_found'})
        if self.headers.get('Origin') != ORIGIN:
            return self.respond(403, {'error': 'origin_rejected'})
        if self.headers.get('Content-Type', '').split(';')[0].strip() != 'application/json':
            return self.respond(415, {'error': 'json_required'})
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if length < 1 or length > 16384:
                return self.respond(413, {'error': 'body_size'})
            self.connection.settimeout(10)
            data = json.loads(self.rfile.read(length))
            lead_id, duplicate = save(data, self.headers.get('X-Real-IP', self.client_address[0]))
            self.respond(200 if duplicate else 201, {'saved': True, 'id': lead_id})
        except (ValueError, TypeError, UnicodeError) as exc:
            reason = str(exc)
            status = 429 if reason == 'rate_limited' else 409 if reason == 'request_conflict' else 400
            self.respond(status, {'error': reason if reason in ('rate_limited', 'request_conflict', 'invalid_contact', 'consent_required', 'invalid_answers', 'invalid_request') else 'invalid_submission'})
        except Exception:
            self.respond(503, {'error': 'save_unavailable'})

if __name__ == '__main__':
    os.umask(0o077)
    initialize()
    threading.Thread(target=worker, daemon=True).start()
    ThreadingHTTPServer(('127.0.0.1', 8766), Handler).serve_forever()
