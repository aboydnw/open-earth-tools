# Development Guide

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account and project
- Environment variables configured

### Setup
```bash
git clone <repository>
cd open-earth-tools
npm install
cp .env.example .env.local
# Configure your Supabase credentials in .env.local
```

### Development Server
```bash
npm run dev
```

### Testing
```bash
# Test CRUD functionality
npm run test:simple

# Test API endpoints (requires dev server running)
npm run test:api

# TypeScript test (full test suite)
npm run test:crud
```

## Project Structure

```
open-earth-tools/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── tools/         # CRUD endpoints
│   ├── page.tsx           # Main page
│   └── layout.tsx         # App layout
├── lib/                   # Core libraries
│   ├── database.ts        # Database operations
│   ├── types.ts          # TypeScript interfaces
│   └── utils.ts          # Utility functions
├── components/            # React components
├── docs/                  # Documentation
│   └── CRUD_API.md       # API documentation
├── scripts/              # Utility scripts
│   ├── test-crud.ts      # Database tests
│   ├── test-api.ts       # API tests
│   └── reset-rls.sql     # RLS policy reset
└── types/                # Global type definitions
```

## Key Technologies

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type safety and developer experience
- **Supabase**: PostgreSQL database with real-time features
- **Tailwind CSS**: Utility-first CSS framework
- **Row Level Security**: Database-level access control

## Development Workflow

### 1. Database Changes
1. Update schema in Supabase dashboard
2. Update TypeScript interfaces in `lib/types.ts`
3. Update database operations in `lib/database.ts`
4. Test with `npm run test:simple`

### 2. API Changes
1. Modify routes in `app/api/tools/`
2. Test with `npm run test:api`
3. Update documentation in `docs/CRUD_API.md`

### 3. Frontend Changes
1. Create/modify components in `components/`
2. Update pages in `app/`
3. Test in browser with `npm run dev`

## Database Schema

### Core Tables
- `tools`: Main tool records
- `attribute_types`: Categories (Organization, License, etc.)
- `attribute_values`: Specific values (MIT, NASA, etc.)
- `tool_attribute_links`: Many-to-many relationships
- `openness_assessments`: Tool openness scores
- `assessment_dimensions`: 6-dimension breakdowns

### Relationships
```
tools (1) → (∞) tool_attribute_links (∞) → (1) attribute_values
attribute_values (∞) → (1) attribute_types
tools (1) → (∞) openness_assessments (1) → (∞) assessment_dimensions
```

## Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Debugging

### Database Issues
```bash
# Check database connection
npm run test:simple

# Verbose database logging
# Add to lib/database.ts:
console.error('Database error:', error)
```

### API Issues
```bash
# Test specific endpoint
curl http://localhost:3000/api/tools

# Check Next.js logs
npm run dev
```

### RLS Policy Issues
Run SQL in Supabase dashboard:
```sql
-- Check current policies
SELECT * FROM pg_policies WHERE tablename = 'tools';

-- Reset policies if needed
\i scripts/reset-rls.sql
```

## Contributing

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for public functions
- Use meaningful variable names

### Testing
- Test database changes with `npm run test:simple`
- Test API changes with `npm run test:api`
- Ensure all tests pass before committing

### Documentation
- Update `docs/CRUD_API.md` for API changes
- Add inline comments for complex logic
- Update this guide for workflow changes

## Deployment

### Production Considerations
1. **Environment Variables**: Use production Supabase credentials
2. **RLS Policies**: Restrict to authenticated users only
3. **Rate Limiting**: Add rate limiting to API routes
4. **Input Validation**: Enhance validation in API routes
5. **Error Handling**: Add proper error boundaries
6. **Monitoring**: Add logging and error tracking

### Security Checklist
- [ ] RLS policies restrict access appropriately
- [ ] Input validation on all API endpoints
- [ ] Authentication required for write operations
- [ ] No sensitive data in client-side code
- [ ] HTTPS enforced in production
- [ ] Rate limiting implemented

## Common Tasks

### Add New Tool Category
1. Create tools with new category via API
2. Category automatically appears in filters
3. No code changes needed

### Add New Attribute Type
1. Modify `createToolAttributes()` in `lib/database.ts`
2. Update TypeScript interfaces if needed
3. Test with `npm run test:simple`

### Update Openness Dimensions
1. Modify interfaces in `lib/types.ts`
2. Update `createOpennessAssessment()` in `lib/database.ts`
3. Update existing assessments if needed

### Add Authentication
1. Set up Supabase Auth
2. Update RLS policies to require authentication
3. Add auth checks to API routes
4. Update frontend with auth components

## Performance Tips

- Use database indexes for frequently queried fields
- Implement pagination for large result sets
- Consider caching for static data
- Optimize complex queries with proper joins
- Monitor query performance in Supabase dashboard

## Troubleshooting

### "Module not found" Errors
- Check import paths are correct
- Ensure files exist and are properly exported
- Verify TypeScript configuration

### RLS Policy Violations
- Check policies allow the operation
- Verify user authentication status
- Review policy conditions in Supabase dashboard

### Database Connection Issues
- Verify environment variables are correct
- Check Supabase project status
- Ensure network connectivity

### Type Errors
- Update TypeScript interfaces when changing data structures
- Check for missing imports
- Run `npm run type-check` to identify issues
