# German and Arabic release

The public website supports Chinese, English, Japanese, German and Arabic. German routes start at `/de`; Arabic routes start at `/ar`. Both include products, applications, company information and the 12-question assessment at `/contact` under their language prefix.

The language selector preserves the current public page. Arabic pages use RTL layout while the company mark, Latin product names and contact values retain their readable direction. Existing Chinese, English and Japanese content is preserved.

Validation:

- `node node_modules/typescript/bin/tsc --noEmit --incremental false`
- `node scripts/build-static.mjs`
- `node scripts/check-languages.mjs`
- `python3 -m unittest discover -s server -p 'test_*.py'`
- Browser checks: German and Arabic public pages at a 390px viewport; complete both assessment flows using a mocked API; inspect German desktop and Arabic desktop/mobile layouts.

Deploy the resulting `out/` directory and the updated `server/leads.py` together. The backend accepts `de` and `ar` and retains the original scoring and email outbox. Preserve the existing SQLite database, protected configuration and service-account mail authorization outside the release directories. No database schema migration is needed. Keep previous release symlinks for rollback.

Only public source and assets belong in GitHub. Customer lead records, OAuth credentials and mail settings remain on the server.
