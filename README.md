# Open Earth Tools Directory

A curated directory of production-ready Earth science visualization tools, with guidance on embedding them safely and an openness assessment for each one.

## Features

- 🌍 **Curated Earth Science Tools**: Vetted tools for Earth science communication
- 🔒 **Secure Embedding**: Security guidance for iframe embedding
- 📊 **Openness Assessment**: Each tool is scored on six dimensions of openness
- 📝 **Reviewed Submissions**: Anyone can suggest a tool or a correction; every change is a pull request
- 🏗️ **No database**: Tool data lives in this repository as JSON files

## Quick Start

### Prerequisites
- Node.js 22+

### Setup
```bash
git clone git@github.com:aboydnw/open-earth-tools.git
cd open-earth-tools
npm install
npm run dev
```

The directory works with no configuration. The add, edit, and delete forms only appear once the submission settings in `.env.example` are filled in. See the [Development Guide](docs/DEVELOPMENT.md).

## How it works

### Data
Each tool is one file: `data/tools/<slug>.json`. The filename is the tool's id. The file holds the tool's details, its attributes, and its openness assessment. Every file is checked against the schema in `lib/tool-schema.ts` when the site builds, so a malformed file fails the build instead of breaking the live site.

To change a tool by hand, edit its file and open a pull request.

### Submissions
The forms on the site do not write data directly. Each one opens a pull request against this repository:

| Form | Endpoint | Pull request |
|---|---|---|
| Add Tool | `POST /api/tools` | Adds a new file, with automated scoring applied |
| Edit | `PUT /api/tools/[id]` | Updates the tool's file |
| Delete | `DELETE /api/tools/[id]` | Removes the tool's file |

A change goes live when its pull request is merged and the site redeploys.

Because the forms are public, submissions pass through several checks before a pull request is opened:

1. A Cloudflare Turnstile bot check
2. Strict validation of every field
3. A check that the tool's URL resolves to a public address and responds
4. A duplicate check against the directory and against open submissions
5. A cap of 10 open submission pull requests

### Automated scoring
New tools are scored by rules in `lib/automation/tool-automation.ts`, based on the tool's URL and the submitter's selections. The scores are a starting point. Check them in the pull request before merging.

## Openness Assessment

Tools are evaluated across 6 dimensions:

1. **Software Licensing** - Open source vs. proprietary
2. **Data Licensing** - Open data vs. restricted access
3. **Technical Accessibility** - Embedding and API access
4. **Data Standards** - Standard formats vs. proprietary
5. **Infrastructure** - Self-hosting vs. SaaS-only
6. **Community Governance** - Community-driven vs. institutional control

## Development

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Data**: JSON files in `data/tools`, validated with Zod
- **Submissions**: Next.js API routes, GitHub REST API, Cloudflare Turnstile
- **Styling**: Tailwind CSS

### Key Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run type-check   # TypeScript
npm test             # Validate tool data and run unit tests
```

See [DEVELOPMENT.md](docs/DEVELOPMENT.md) for setup and deployment details.

## License

[Add your license here]
