# Open Earth Tools Directory

A curated directory of production-ready Earth science visualization tools with secure embedding practices and comprehensive metadata.

## Features

- 🌍 **Curated Earth Science Tools**: High-quality, vetted tools for Earth science communication
- 🔒 **Secure Embedding**: Comprehensive security guidance for safe iframe embedding  
- 📊 **Openness Assessment**: 6-dimension evaluation of tool openness and accessibility
- 🔄 **Full CRUD API**: Complete programmatic tool management
- 🏗️ **Modern Architecture**: Next.js 15, TypeScript, Supabase

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account

### Setup
```bash
git clone <repository>
cd open-earth-tools
npm install
cp .env.example .env.local
# Configure Supabase credentials in .env.local
```

### Development
```bash
npm run dev
```

### Testing
```bash
# Test CRUD functionality
npm run test:simple
```

## Documentation

- **[CRUD API Documentation](docs/CRUD_API.md)**: Complete API reference
- **[Development Guide](docs/DEVELOPMENT.md)**: Setup and workflow guide

## Architecture

### Database Schema
- **Tools**: Main tool records with metadata
- **Attributes**: Flexible attribute system (organization, license, features)
- **Assessments**: 6-dimension openness scoring system

### API Endpoints
- `GET /api/tools` - List tools with filtering
- `POST /api/tools` - Create new tools
- `GET /api/tools/[id]` - Get specific tool
- `PUT /api/tools/[id]` - Update tools
- `DELETE /api/tools/[id]` - Delete tools

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
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL with Row Level Security
- **Styling**: Tailwind CSS

### Key Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run test:simple  # Test CRUD operations
npm run test:api     # Test API endpoints
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `npm run test:simple`
5. Submit a pull request

See [DEVELOPMENT.md](docs/DEVELOPMENT.md) for detailed guidelines.

## Security

### Current (Development)
- Permissive RLS policies for testing
- No authentication required
- Basic input validation

### Production Ready
- Restrict RLS policies to authenticated users
- Implement proper authentication
- Add comprehensive input validation
- Rate limiting and monitoring

## License

[Add your license here]

## Support

For questions or issues:
1. Check the [documentation](docs/)
2. Review existing issues
3. Create a new issue with detailed information
