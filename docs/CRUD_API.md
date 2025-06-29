# CRUD API Documentation

This document describes the CRUD (Create, Read, Update, Delete) functionality for the Open Earth Tools Directory.

## Overview

The CRUD system allows programmatic management of Earth science tools in the directory. It consists of:

- **Database Layer**: TypeScript classes with full CRUD operations
- **API Routes**: RESTful endpoints for HTTP operations  
- **Data Model**: Complex relational structure with attributes and assessments

## Database Architecture

### Core Tables

- **`tools`**: Main tool records (name, URL, description, etc.)
- **`attribute_types`**: Categories of attributes (Organization, License, etc.)
- **`attribute_values`**: Specific attribute values (MIT, NASA, etc.)
- **`tool_attribute_links`**: Many-to-many relationships between tools and attributes
- **`openness_assessments`**: Openness scores and levels for tools
- **`assessment_dimensions`**: 6-dimension breakdowns of openness scores

### Data Flow

1. **Tool Creation**: Insert main record → Create/link attributes → Create assessment
2. **Tool Updates**: Update main record → Replace attributes → Update assessment  
3. **Tool Deletion**: Cascade delete assessments → attributes → main record

## API Endpoints

### Base URL: `/api/tools`

#### GET `/api/tools`
List all tools with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by category name

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Tool Name",
      "organization": "Organization Name",
      "description": "Tool description",
      "url": "https://tool-url.com",
      "embedUrl": "https://tool-url.com/embed",
      "license": "MIT",
      "category": "Data Visualization", 
      "features": ["Feature 1", "Feature 2"],
      "icon": "🌍",
      "status": "Production",
      "embedSupported": true,
      "embedNote": "Embedding details",
      "openness": {
        "score": 4.5,
        "level": "Mostly Open",
        "dimensions": {
          "Software Licensing": { "score": "green", "note": "MIT license" },
          "Data Licensing": { "score": "green", "note": "Open data" },
          "Technical Accessibility": { "score": "yellow", "note": "Some restrictions" },
          "Data Standards": { "score": "green", "note": "Standard formats" },
          "Infrastructure": { "score": "yellow", "note": "Can self-host" },
          "Community Governance": { "score": "yellow", "note": "Limited community input" }
        }
      }
    }
  ],
  "count": 1
}
```

#### POST `/api/tools`
Create a new tool.

**Required Fields:**
- `name`, `url`, `description`, `organization`, `license`, `category`

**Request Body:**
```json
{
  "name": "New Earth Tool",
  "url": "https://example.com/tool",
  "description": "A tool for Earth science analysis",
  "organization": "Example Org",
  "license": "MIT",
  "category": "Data Visualization",
  "embedUrl": "https://example.com/tool/embed",
  "features": ["Real-time data", "Interactive maps"],
  "icon": "🌍",
  "status": "Production",
  "embedSupported": true,
  "embedNote": "Full embedding support",
  "openness": {
    "score": 4,
    "level": "Mostly Open",
    "dimensions": {
      "Software Licensing": { "score": "green", "note": "MIT license available" },
      "Data Licensing": { "score": "green", "note": "Uses open data" },
      "Technical Accessibility": { "score": "yellow", "note": "Some embedding limits" },
      "Data Standards": { "score": "green", "note": "GeoJSON support" },
      "Infrastructure": { "score": "yellow", "note": "Self-hosting possible" },
      "Community Governance": { "score": "yellow", "note": "Accepts contributions" }
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* created tool object */ }
}
```

#### GET `/api/tools/[id]`
Get a specific tool by ID.

**Response:** Same as individual tool object from GET `/api/tools`

#### PUT `/api/tools/[id]`
Update an existing tool. Supports partial updates.

**Request Body:** Same structure as POST, but all fields optional except those being updated.

**Response:**
```json
{
  "success": true,
  "data": { /* updated tool object */ }
}
```

#### DELETE `/api/tools/[id]`
Delete a tool and all related records.

**Response:**
```json
{
  "success": true,
  "message": "Tool deleted successfully"
}
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes:**
- `400`: Bad Request (missing required fields, invalid data)
- `404`: Not Found (tool doesn't exist)
- `500`: Internal Server Error (database issues, etc.)

## Database Layer Usage

### Direct Database Operations

```typescript
import { toolsDb } from '@/lib/database'

// Create a tool
const newTool = await toolsDb.createTool({
  name: "Test Tool",
  url: "https://example.com",
  description: "A test tool",
  organization: "Test Org",
  license: "MIT", 
  category: "Testing",
  embedUrl: "https://example.com/embed",
  features: ["Testing", "Development"],
  icon: "🧪",
  status: "Development",
  embedSupported: true,
  embedNote: "Test embedding",
  openness: { /* openness assessment object */ }
})

// Read tools
const allTools = await toolsDb.getTools()
const tool = await toolsDb.getTool(toolId)
const categoryTools = await toolsDb.getToolsByCategory("Data Visualization")

// Update a tool
const updatedTool = await toolsDb.updateTool(toolId, {
  description: "Updated description",
  features: ["New Feature", "Updated Feature"]
})

// Delete a tool
await toolsDb.deleteTool(toolId)

// Get statistics
const stats = await toolsDb.getStats()
```

## Openness Assessment System

Tools are evaluated across 6 dimensions:

1. **Software Licensing**: Open source vs. proprietary
2. **Data Licensing**: Open data vs. restricted access  
3. **Technical Accessibility**: Embedding and API access
4. **Data Standards**: Standard formats vs. proprietary
5. **Infrastructure**: Self-hosting vs. SaaS-only
6. **Community Governance**: Community-driven vs. institutional control

### Scoring:
- **Green** (1 point): Fully open/accessible
- **Yellow** (0.5 points): Partially open/limited
- **Red** (0 points): Closed/restricted

### Levels:
- **6 points**: Fully Open
- **4-5 points**: Mostly Open  
- **2-3 points**: Partially Open
- **0-1 points**: Minimally Open

## Testing

Test the CRUD functionality:

```bash
# Test database operations directly
npm run test:crud

# Test API endpoints (requires dev server)
npm run dev  # Terminal 1
npm run test:api  # Terminal 2

# Simple test
npm run test:simple
```

## Security Considerations

### Current Setup (Development)
- **RLS Policies**: Very permissive for testing
- **Authentication**: Not required
- **Validation**: Basic field validation only

### Production Recommendations
- **Restrict RLS policies** to authenticated users
- **Add authentication** for write operations
- **Implement authorization** (admin vs. contributor roles)
- **Add input validation** (URL validation, XSS prevention)
- **Rate limiting** on API endpoints
- **Audit logging** for changes

### Example Production RLS Policy
```sql
-- Only authenticated users can create tools
CREATE POLICY "authenticated_insert_tools" 
ON tools FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = created_by);

-- Users can only update their own tools
CREATE POLICY "users_update_own_tools" 
ON tools FOR UPDATE 
TO authenticated 
USING (auth.uid() = created_by) 
WITH CHECK (auth.uid() = created_by);
```

## Data Validation

### Required Fields
- `name`: Tool name (string)
- `url`: Main tool URL (valid URL)
- `description`: Tool description (string)
- `organization`: Organization name (string) 
- `license`: License type (string)
- `category`: Tool category (string)

### Optional Fields  
- `embedUrl`: Embedding URL (defaults to main URL)
- `features`: Array of feature strings
- `icon`: Emoji icon (defaults to 🌍)
- `status`: Tool status (defaults to "Production")
- `embedSupported`: Boolean (defaults to false)
- `embedNote`: Embedding notes (string)
- `openness`: Full openness assessment object

### Data Types
- **UUIDs**: Auto-generated for all record IDs
- **Timestamps**: Auto-generated for created_at, updated_at
- **JSON**: Complex objects stored as JSON in PostgreSQL
- **Text**: All string fields stored as TEXT
- **Boolean**: embedSupported field

## Performance Considerations

- **Indexes**: UUIDs and foreign keys are indexed
- **Joins**: Complex queries use proper joins for related data
- **Caching**: Consider adding Redis for frequently accessed data
- **Pagination**: Implement pagination for large result sets
- **Bulk Operations**: Consider bulk insert/update for large datasets

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**: 
   - Check that policies allow the operation
   - Verify user authentication status
   - Review policy conditions

2. **Duplicate Key Errors**:
   - Usually indicates existing tool with same ID
   - Check for proper cleanup in update operations

3. **Foreign Key Violations**:
   - Ensure proper cascade deletion order
   - Verify related records exist before linking

4. **Missing Data**:
   - Check that all required fields are provided
   - Verify openness assessment structure is complete

### Debug Mode

Enable detailed error logging:

```typescript
// Add to database operations
console.error('Database error:', error)
console.log('Query data:', data)
```

Run tests with verbose output:

```bash
npm run test:simple 2>&1 | grep -E "(✅|❌|Error)"
```
