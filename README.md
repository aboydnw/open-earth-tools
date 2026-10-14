# Open Earth Tools Directory

A curated directory of production-ready Earth science visualization tools, with guidance on embedding them safely and an openness assessment for each one.

Live at [openearthtools.anthonynboyd.com](https://openearthtools.anthonynboyd.com).

## Features

- 🌍 **Curated Earth Science Tools**: Vetted tools for Earth science communication
- 🔒 **Secure Embedding**: Security guidance for iframe embedding
- 📊 **Openness Assessment**: Each tool is scored on six dimensions of openness
- ✏️ **Admin editing**: Add, edit, and delete tools at `/admin`; changes are live immediately
- 💡 **Public suggestions**: Anyone can suggest a tool; it goes live once approved in `/admin`
- 💾 **Nightly backup**: The database is copied to `data/tools/*.json` in this repository every night

## How it works

The site runs on Cloudflare Workers using [vinext](https://github.com/cloudflare/vinext), Cloudflare's Vite-based implementation of the Next.js API.

### Data
Tools live in a Cloudflare D1 database, one row per tool. Each row holds the tool as a JSON document, checked against the schema in `lib/tool-schema.ts` on every read and write.

`data/tools/<slug>.json` holds the nightly backup of that database, one file per tool. The same files seed a new database.

### Editing
`/admin` shows the directory with Edit Mode, Add Tool, Edit, and Delete controls. It and the `/api/admin` endpoints sit behind Cloudflare Access, and the server also checks the Access sign-in token on every request.

Adding a tool fills in organization, category, license, embed support, and the openness assessment with rules in `lib/automation/tool-automation.ts`. Check them with Edit afterwards.

## Openness Assessment

Tools are evaluated across 6 dimensions:

1. **Software Licensing** - Open source vs. proprietary
2. **Data Licensing** - Open data vs. restricted access
3. **Technical Accessibility** - Embedding and API access
4. **Data Standards** - Standard formats vs. proprietary
5. **Infrastructure** - Self-hosting vs. SaaS-only
6. **Community Governance** - Community-driven vs. institutional control

## Development

### Quick start
```bash
npm install
cp .dev.vars.example .dev.vars
npm run db:migrate:local
npm run db:seed:local
npm run dev
```

The public directory is at `/` and the editor at `/admin`. `.dev.vars` lets `/admin` work on localhost without Cloudflare Access.

### Tech Stack
- **App**: vinext (Next.js App Router API on Vite), React 19, TypeScript
- **Hosting**: Cloudflare Workers
- **Data**: Cloudflare D1, validated with Zod
- **Auth**: Cloudflare Access
- **Styling**: Tailwind CSS

### Key Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run type-check   # TypeScript
npm test             # Unit tests, including a check of every backup file
```

See [DEVELOPMENT.md](docs/DEVELOPMENT.md) for setup, deployment, and backups.

## License

[Add your license here]
