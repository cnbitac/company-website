# Website assessment intake

Python 3.12 standard library service, bound only to 127.0.0.1:8766 behind Nginx. SQLite stores submissions and a durable email outbox outside the public website directory. Contact information and credentials are never part of the repository or static site output.

The intake supports Chinese (`zh`), English (`en`), Japanese (`ja`), German (`de`) and Arabic (`ar`). The selected language is saved with the lead. All languages use the same WAIC questions, CNY thresholds and scoring rules. Adding languages does not require a database migration or a change to notification recipients.

## Operations

- `POST /api/leads`: validates 12 answers, explicit consent, contact and language; recomputes the WAIC result on the server. An idempotency key prevents duplicate records on retry. Reusing a key with changed content is rejected.
- `GET /api/health`: liveness only, no customer data or configuration.
- `leads.sqlite3` in the systemd StateDirectory contains records and delivery state. Authorized operators access it through SSH; there is no public lead-list endpoint.
- A background worker sends **one notification message**, using configured To and CC recipients. This is not a forward from the sales mailbox. The authenticated sending account may differ from all recipients.
- Recipient lists are provided through protected server configuration, never from browser input. The production provider is Agently CLI: OAuth belongs to the service account and is separate from any desktop authorization. Only the approved fixed recipients are passed to the CLI, with explicit send authorization. The optional SMTP adapter uses verified TLS on port 465.
- Agently mail requires a working server authorization. Auth/permanent rejection errors are marked blocked for operator action; transient failures retry at most twice; quota limits retry later. Check `manage.py status` regularly. The account quota also limits notification volume; it does not affect saving leads.
- Undelivered mail stays in the outbox. Temporary errors retry with bounded exponential backoff. Partial recipient rejection retries only rejected recipients. A connection interruption after SMTP acceptance may still cause a duplicate email on retry; the stable Message-ID and lead reference help identify duplicates.
- `configure-mail.py` is run interactively with sudo on the host. It verifies SMTP login, then atomically saves the password with restricted permissions. It does not print the password. Existing notification addresses are preserved.
- The user-facing success message means the database transaction committed, not that mail reached every inbox.
- Per-IP hourly rate limiting, a honeypot, request-size limit and Origin checking provide baseline abuse controls. Origin is not a substitute for user authentication; no sensitive reads are exposed.

## Validation and maintenance

Run `python3 -m unittest discover -s server -p 'test_*.py'`. Keep database backups outside the public root and restrict access. Review pending/retry notifications with the maintenance CLI. Contact access/correction/deletion requests can be handled by an authorized operator over SSH. Backups must follow the same access and retention controls.

The original question and scoring source is the WAIC PHM maturity assessment. Business-value dimensions are not collapsed into a misleading overall readiness percentage. Unknown answers produce a pending result.
