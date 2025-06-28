# Open Earth Tools Directory

A curated collection of open source Earth science visualization tools ready for safe embedding and storytelling. Quality-vetted tools from NASA, USGS, NOAA and the community.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account and project

### Setup

1. **Clone and install dependencies:**
```bash
git clone [your-repo-url]
cd open-earth-tools
npm install
```

2. **Environment Configuration:**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

3. **Database Setup:**
```bash
# Run SQL schema in your Supabase SQL editor first (see sql/add_tool_columns.sql)
npm run migrate
```

4. **Development:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15.3.4, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel-ready

### Project Structure
```
├── app/                 # Next.js app router
├── components/          # React components
├── lib/                 # Core utilities and types
├── utils/               # Helper functions and services
├── data/                # Static data (migration source)
├── schemas/             # Validation schemas
├── sql/                 # Database migrations
└── config/              # Configuration files
```

## 🔧 Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run migrate      # Migrate tools to database
npm run migrate:cleanup  # Clean up migration data
npm run migrate:verify   # Verify migration results
```

## 📊 Database Schema

The application uses a flexible attribute-based system:

- `tools` - Core tool information
- `attribute_types` - Categories, Organizations, etc.
- `attribute_values` - Specific values for each type
- `tool_attribute_links` - Many-to-many relationships
- `openness_assessments` - Tool openness scoring
- `assessment_dimensions` - Detailed dimension scores

## 🌍 Contributing

### Adding New Tools

1. Use the database interface or API
2. Follow the tool assessment framework
3. Ensure proper openness evaluation
4. Test embedding capabilities

### Assessment Framework

Tools are evaluated across 6 dimensions:
- **Software Licensing** (open source vs proprietary)
- **Data Licensing** (open data vs restricted)
- **Technical Accessibility** (embedding support)
- **Data Standards** (standard formats vs proprietary)
- **Infrastructure** (self-hostable vs SaaS-only)
- **Community Governance** (open vs institutional control)

## 🔒 Security

- Content Security Policy (CSP) headers configured
- Iframe sandboxing for embedded tools
- Environment variable validation
- Secure Supabase integration

## 📱 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy!

### Other Platforms

The application is a standard Next.js app and can be deployed on:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Self-hosted with Docker

## 🤝 Development Workflow

1. **Local Development**: Use `npm run dev` with `.env.local`
2. **Database Changes**: Update SQL files and run migrations
3. **New Components**: Follow existing patterns in `/components`
4. **Testing**: Test embedding functionality with real tools
5. **Deployment**: Ensure all environment variables are set

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tool Assessment Guide](./tool-evaluation-guide.md)

## 📄 License

[Add your license here]

## 🆘 Troubleshooting

### Build Errors
- Ensure `tailwind.config.ts` exists
- Check environment variables are set
- Verify Node.js version (18+)

### Database Issues
- Run `npm run migrate:verify` to check data
- Ensure Supabase URL and keys are correct
- Check RLS policies in Supabase dashboard

### Embedding Problems
- Verify CSP headers in middleware.ts
- Check tool iframe restrictions
- Test embedding in development first