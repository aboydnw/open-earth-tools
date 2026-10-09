# Development Guide

## Setup

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. The directory reads its data from `data/tools`, so there is nothing else to set up for browsing.

## Project structure

```
app/
├── page.tsx                  # Server component: loads tools at build time
└── api/tools/                # Submission endpoints (POST, PUT, DELETE)
components/
├── Directory.tsx             # Client UI: search, filters, modals
└── ui/
    ├── forms/                # Search bar, Turnstile widget, submission hook
    └── modals/               # Add, edit, delete, preview, embed
data/
├── tools/                    # One JSON file per tool
└── archive/                  # Raw export of the old Supabase database
lib/
├── tool-schema.ts            # Zod schemas for tool files and submissions
├── tools-data.ts             # Reads and validates data/tools
├── automation/               # Rule-based scoring for new tools
└── submissions/              # Turnstile, URL check, GitHub, submit flow
tests/                        # Vitest unit tests
```

## Tool data

Each tool is `data/tools/<slug>.json`. The slug is the tool's id and should not change once the tool is published, even if the tool is renamed.

`lib/tool-schema.ts` is the single definition of what a tool file may contain. Unknown fields are rejected. If you add a field, add it to the schema first.

`npm test` loads every file, so it doubles as a data check. CI runs it on every pull request.

## Submissions

The forms post to `app/api/tools`. The flow for all three actions lives in `lib/submissions/submit.ts`:

1. Check that submissions are configured
2. Validate the request body
3. Verify the Turnstile token with Cloudflare
4. Check for duplicates in the directory
5. Check that the tool URL is public and reachable
6. Check open submission pull requests for duplicates and for the cap
7. Create a branch named `submission/<action>/<slug>/<timestamp>`, commit the file change, and open a pull request

The response includes a link to the pull request only when the repository is public.

### Environment variables

Copy `.env.example` to `.env.local`.

| Variable | Purpose |
|---|---|
| `GITHUB_TOKEN` | Fine-grained personal access token for this repository only, with read/write access to **Contents** and **Pull requests** |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key, used by the forms |
| `TURNSTILE_SECRET_KEY` | Turnstile secret key, used by the server |
| `GITHUB_REPO` | Optional. Defaults to `aboydnw/open-earth-tools` |
| `GITHUB_BASE_BRANCH` | Optional. Defaults to `main` |

If any of the first three is missing, the forms are hidden and the API answers `503`.

`NEXT_PUBLIC_TURNSTILE_SITE_KEY` is read when the site builds, so changing it needs a redeploy.

For local work, Cloudflare publishes test keys that always pass. They are listed in `.env.example`. Point `GITHUB_REPO` at a scratch repository if you want to try the full flow without opening pull requests here.

### Embedding and the Content Security Policy

`middleware.ts` sets the site's Content Security Policy. A tool preview only loads if the tool's domain is listed under `frame-src`. When you merge a new embeddable tool, add its domain there.

## Checks

```bash
npm run type-check
npm test
npm run build
```

## Deployment

The site deploys on Vercel from `main`.

1. Add `GITHUB_TOKEN`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, and `TURNSTILE_SECRET_KEY` in the Vercel project settings
2. In the Turnstile widget settings, add the site's domain
3. Redeploy

Merging a submission pull request triggers a new deployment, which is how approved changes reach the live site.
