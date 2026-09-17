"""Run via SSH as the service user. No public administration endpoint."""
import argparse
import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
import leads

p = argparse.ArgumentParser()
p.add_argument('action', choices=['status', 'list', 'show', 'retry', 'backup'])
p.add_argument('--id')
args = p.parse_args()
with leads.connect() as c:
    if args.action == 'status':
        print(json.dumps([dict(r) for r in c.execute('SELECT mail_status, count(*) AS count FROM leads GROUP BY mail_status')]))
    elif args.action == 'list':
        print(json.dumps([dict(r) for r in c.execute('SELECT id,created_at,language,result,mail_status FROM leads ORDER BY created_at DESC LIMIT 100')], ensure_ascii=False))
    elif args.action == 'show':
        row = c.execute('SELECT * FROM leads WHERE id=?', (args.id,)).fetchone()
        print(json.dumps(dict(row) if row else {}, ensure_ascii=False))
    elif args.action == 'retry':
        if not args.id:
            raise SystemExit('--id is required; verify the delivery outcome before retrying a blocked notification')
        c.execute("UPDATE leads SET mail_status='pending',next_attempt=0,attempts=0 WHERE id=? AND mail_status='blocked'", (args.id,))
    else:
        backup_dir = Path(leads.DB).parent / 'backups'
        backup_dir.mkdir(mode=0o700, exist_ok=True)
        path = backup_dir / ('leads-' + datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S') + '.sqlite3')
        with sqlite3.connect(path) as target:
            c.backup(target)
        path.chmod(0o600)
        print('Backup created: ' + path.name)
