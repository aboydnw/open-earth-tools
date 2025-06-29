## Fix for RLS Policy Issue

You're absolutely right - we shouldn't need service keys for basic CRUD operations. The issue is that your RLS policies are too restrictive.

### Solution: Update RLS Policies

Go to your Supabase dashboard → SQL Editor and run this:

```sql
-- Allow public access to all tables for development/testing
-- You can make these more restrictive later for production

-- Tools table
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON tools;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON tools;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON tools;  
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON tools;

CREATE POLICY "Allow all operations on tools" ON tools FOR ALL TO public USING (true) WITH CHECK (true);

-- Related tables
CREATE POLICY "Allow all operations on attribute_types" ON attribute_types FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on attribute_values" ON attribute_values FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on tool_attribute_links" ON tool_attribute_links FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on openness_assessments" ON openness_assessments FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on assessment_dimensions" ON assessment_dimensions FOR ALL TO public USING (true) WITH CHECK (true);
```

### After running that SQL:

1. The CRUD operations will work with the regular anon key
2. No service keys needed
3. Much more secure approach
4. You can restrict policies later for production

Then run your test:
```bash
npm run test:simple
```

This is the proper way to handle RLS - adjust the policies rather than bypassing them with service keys.
