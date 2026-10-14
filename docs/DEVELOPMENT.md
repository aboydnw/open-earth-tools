# Development Guide

## Local setup

```bash
npm install
cp .dev.vars.example .dev.vars   # lets /admin work on localhost
npm run db:migrate:local         # create the local D1 table
npm run db:seed:local            # load data/tools into it
npm run dev
```

The local database lives in `.wrangler/state`. Run `npm run db:seed:local` again to reset it to the backup files.

`ADMIN_DEV_BYPASS=true` in `.dev.vars` only applies to requests for `localhost` or `127.0.0.1`. Never set it as a production variable.

## Project structure

```
app/
├── page.tsx                  # Public directory (read-only)
├── admin/page.tsx            # Same directory with editing controls
└── api/admin/tools/          # POST, PUT, DELETE for admins
components/
├── Directory.tsx             # Client UI: search, filters, modals
└── ui/modals/                # Add, edit, delete, preview, embed
data/tools/                   # Nightly backup, one JSON file per tool
lib/
├── tool-schema.ts            # Zod schemas for a tool and for admin requests
├── tools-repo.ts             # D1 queries
├── admin/access.ts           # Cloudflare Access token check
├── admin/tools.ts            # Add, edit, delete rules
└── automation/               # Rule-based scoring for new tools
migrations/                   # D1 schema
scripts/
├── seed-sql.mjs              # data/tools -> SQL
└── export-json.mjs           # D1 rows -> data/tools
tests/                        # Vitest
```

## Data

D1 has one table, `tools`, with an `id` (the slug), the tool as a JSON document in `data`, and timestamps. `lib/tool-schema.ts` is the single definition of what a tool may contain. Unknown fields are rejected. To add a field, add it to the schema; no database migration is needed.

A tool's id should not change once published, even if the tool is renamed.

## Admin access

Cloudflare Access sits in front of `/admin` and `/api/admin`. Behind it, `lib/admin/access.ts` checks the `Cf-Access-Jwt-Assertion` header on every admin request:

- The signature must match the team's published keys
- The issuer must be the team domain
- The audience must be the Access application's AUD tag
- The token must not be expired

If `ACCESS_TEAM_DOMAIN` or `ACCESS_AUD` is empty, every admin request is refused.

## First-time Cloudflare setup

1. **Log in.** On a machine with a browser, run `npx wrangler login`. On a headless machine, create an API token (below) and export `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` instead.
2. **Create the database.**
   ```bash
   npx wrangler d1 create open-earth-tools
   ```
   Put the printed `database_id` in `wrangler.jsonc`.
3. **Create the table and load the data.**
   ```bash
   npx wrangler d1 migrations apply open-earth-tools --remote
   node scripts/seed-sql.mjs > seed.sql
   npx wrangler d1 execute open-earth-tools --remote --file seed.sql
   ```
4. **Set up Access.** In Cloudflare Zero Trust, go to Access → Applications and add a self-hosted application:
   - Domain `openearthtools.anthonynboyd.com`, paths `admin` and `api/admin`
   - A policy that allows only your email address

   Copy the team domain (`<team>.cloudflareaccess.com`) and the application's AUD tag into `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` in `wrangler.jsonc`.
5. **Add GitHub secrets.** Create a Cloudflare API token with **Workers Scripts: Edit**, **D1: Edit**, and **Workers Routes: Edit** for the `anthonynboyd.com` zone. Add it to the repository as `CLOUDFLARE_API_TOKEN`, and add your account id as `CLOUDFLARE_ACCOUNT_ID`.
6. **Deploy** by merging to `main`, or run `npm run deploy` locally.

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main`. It runs the tests, applies any new D1 migrations, then builds and deploys the Worker. The Worker serves `openearthtools.anthonynboyd.com` through the custom domain route in `wrangler.jsonc`.

## Backups

`.github/workflows/backup.yml` runs every night, and on demand from the Actions tab:

1. Reads every row from D1
2. Rewrites `data/tools/*.json`, removing files for deleted tools
3. Runs the tests, which load every file
4. Commits to `main` if anything changed

It refuses to run if D1 returns no rows, so an empty or broken database never wipes the backup.

To restore, seed from the files as in step 3 above.

## Embedding and the Content Security Policy

`middleware.ts` sets the site's Content Security Policy. A tool preview only loads if the tool's domain is listed under `frame-src`. When you add an embeddable tool, add its domain there.

## Checks

```bash
npm run type-check
npm test
npm run build
```
