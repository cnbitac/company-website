import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
import leads

class LeadTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        leads.DB = str(Path(self.tmp.name) / 'leads.sqlite3')
        leads.initialize()
        self.payload = {'requestId': 'test-request-00000001', 'answers': {q['id']: '2' for q in leads.QUESTIONS}, 'contactKind': 'email', 'contact': 'test@example.invalid', 'language': 'zh', 'consent': True, 'consentVersion': '2026-09-17'}

    def tearDown(self):
        self.tmp.cleanup()

    def test_validation_and_idempotency(self):
        lead_id, duplicate = leads.save(self.payload, 'test')
        self.assertFalse(duplicate)
        self.assertEqual(leads.save(self.payload, 'test'), (lead_id, True))
        with leads.connect() as db:
            row = db.execute('SELECT * FROM leads').fetchone()
            self.assertEqual(json.loads(row['result'])['id'], 'immediate')
            self.assertEqual(row['mail_status'], 'pending')
        with self.assertRaises(ValueError):
            leads.save({**self.payload, 'contact': 'different@example.invalid'}, 'test')
        for bad in ({'consent': False}, {'answers': {}}, {'contact': 'bad\r\nBcc: other'}, {'contactKind': 'invalid'}, {'language': 'invalid'}):
            with self.assertRaises(ValueError):
                leads.save({**self.payload, **bad}, 'test')

    def test_notifications_use_single_message_to_and_cc(self):
        leads.save(self.payload, 'test')
        cfg = {'host': 'localhost', 'user': 'sender@example.invalid', 'password': 'test', 'to': ['sales@example.invalid'], 'cc': ['cc1@example.invalid', 'cc2@example.invalid']}
        with patch.object(leads, 'mail_config', return_value=cfg), patch.object(leads.smtplib, 'SMTP_SSL') as smtp:
            client = smtp.return_value.__enter__.return_value
            client.send_message.return_value = {}
            leads.deliver_once()
            msg = client.send_message.call_args.args[0]
            self.assertEqual(msg['To'], 'sales@example.invalid')
            self.assertEqual(msg['Cc'], 'cc1@example.invalid, cc2@example.invalid')
            self.assertEqual(len(client.send_message.call_args.kwargs['to_addrs']), 3)
            leads.deliver_once()
            self.assertEqual(client.send_message.call_count, 1)

    def test_new_languages_preserve_language_and_scoring(self):
        for language in ('de', 'ar'):
            with self.subTest(language=language):
                payload = {**self.payload, 'language': language, 'requestId': 'language-test-request-' + language}
                lead_id, duplicate = leads.save(payload, 'language-test')
                self.assertFalse(duplicate)
                with leads.connect() as db:
                    row = db.execute('SELECT * FROM leads WHERE id=?', (lead_id,)).fetchone()
                    self.assertEqual(row['language'], language)
                    self.assertEqual(json.loads(row['result'])['id'], 'immediate')
                    self.assertEqual(row['mail_status'], 'pending')

    def test_partial_delivery_retries_only_failed_recipient(self):
        leads.save(self.payload, 'test')
        cfg = {'host': 'localhost', 'user': 'sender@example.invalid', 'password': 'test', 'to': ['sales@example.invalid'], 'cc': ['cc@example.invalid']}
        with patch.object(leads, 'mail_config', return_value=cfg), patch.object(leads.smtplib, 'SMTP_SSL') as smtp:
            client = smtp.return_value.__enter__.return_value
            client.send_message.return_value = {'cc@example.invalid': (450, b'temporary')}
            leads.deliver_once()
            with leads.connect() as db:
                row = db.execute('SELECT * FROM leads').fetchone()
                self.assertEqual(row['mail_status'], 'retry')
                self.assertEqual(json.loads(row['delivered']), ['sales@example.invalid'])
                db.execute('UPDATE leads SET next_attempt=0')
            client.send_message.return_value = {}
            leads.deliver_once()
            self.assertEqual(client.send_message.call_args.kwargs['to_addrs'], ['cc@example.invalid'])

    def test_missing_smtp_keeps_lead_pending(self):
        leads.save(self.payload, 'test')
        with patch.object(leads, 'mail_config', return_value={}):
            leads.deliver_once()
        with leads.connect() as db:
            self.assertEqual(db.execute('SELECT mail_status FROM leads').fetchone()[0], 'pending')

    def test_unknown_does_not_score_as_zero(self):
        answers = self.payload['answers'] | {'df_history': 'unknown'}
        result = leads.score(answers)
        self.assertEqual(result['id'], 'pending')
        self.assertEqual(result['levels']['dataFoundation'], 'pending')

    def test_agently_single_send_with_fixed_cc(self):
        leads.save(self.payload, 'test')
        cfg = {'provider': 'agently', 'user': 'sender@example.invalid', 'to': ['sales@example.invalid'], 'cc': ['cc1@example.invalid', 'cc2@example.invalid']}
        with patch.object(leads, 'mail_config', return_value=cfg), patch.object(leads.subprocess, 'run') as run:
            run.return_value.returncode = 0
            run.return_value.stdout = '{"ok":true}'
            leads.deliver_once()
            args = run.call_args.args[0]
            self.assertEqual(args.count('--to'), 1)
            self.assertEqual(args.count('--cc'), 2)
            self.assertIn('--confirmed', args)
            self.assertNotIn(self.payload['contact'], args)
            leads.deliver_once()
            self.assertEqual(run.call_count, 1)

    def test_agently_auth_failure_requires_operator(self):
        leads.save(self.payload, 'test')
        cfg = {'provider': 'agently', 'user': 'sender@example.invalid', 'to': ['sales@example.invalid'], 'cc': ['cc@example.invalid']}
        with patch.object(leads, 'mail_config', return_value=cfg), patch.object(leads.subprocess, 'run') as run:
            run.return_value.returncode = 3
            run.return_value.stdout = '{"ok":false}'
            leads.deliver_once()
            with leads.connect() as db:
                self.assertEqual(db.execute('SELECT mail_status FROM leads').fetchone()[0], 'blocked')

if __name__ == '__main__':
    unittest.main()
