"""Run with sudo in an interactive server terminal. Never paste secrets in chat."""
import getpass
import grp
import json
import os
import smtplib
import ssl
from pathlib import Path

if os.geteuid() != 0:
    raise SystemExit('Run with sudo.')
path = Path('/etc/linkedti/leads.json')
config = json.loads(path.read_text())
print('Tencent enterprise mailbox SMTP setup. Password will NOT be displayed.')
user = input('Sending mailbox [sales@linkedti.com]: ').strip() or 'sales@linkedti.com'
if not user.endswith('@linkedti.com') or any(c.isspace() for c in user):
    raise SystemExit('Please use an authorized @linkedti.com mailbox.')
password = getpass.getpass('Mailbox client authorization password: ')
if not password:
    raise SystemExit('No password provided. Configuration unchanged.')
try:
    with smtplib.SMTP_SSL('smtp.exmail.qq.com', 465, timeout=20, context=ssl.create_default_context()) as smtp:
        smtp.login(user, password)
except Exception as exc:
    raise SystemExit('SMTP verification failed (' + type(exc).__name__ + '). Configuration unchanged.')
config.update(host='smtp.exmail.qq.com', port=465, user=user, password=password)
os.umask(0o077)
temporary = path.with_suffix('.new')
temporary.write_text(json.dumps(config))
os.chown(temporary, 0, grp.getgrnam('linkedti-leads').gr_gid)
temporary.chmod(0o640)
temporary.replace(path)
print('SMTP verified and saved. Pending lead notifications will be sent automatically.')
