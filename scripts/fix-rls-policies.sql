-- Update RLS policies to allow proper CRUD operations
-- This script should be run in your Supabase SQL editor

-- First, let's see what policies currently exist
-- You can check this in the Supabase dashboard under Authentication > Policies

-- For the tools table, we need policies that allow:
-- 1. Anyone to read tools (SELECT)
-- 2. Anyone to create tools (INSERT) - for testing/development
-- 3. Anyone to update tools (UPDATE) - for testing/development  
-- 4. Anyone to delete tools (DELETE) - for testing/development

-- Enable RLS on tools table (if not already enabled)
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Drop existing restrictive policies (if any)
DROP POLICY IF EXISTS "Enable read access for all users" ON tools;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON tools;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON tools;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON tools;

-- Create permissive policies for development/testing
-- Note: In production, you'd want more restrictive policies

-- Allow all users to read tools
CREATE POLICY "Allow public read access to tools" 
ON tools FOR SELECT 
TO public 
USING (true);

-- Allow all users to insert tools (for testing)
CREATE POLICY "Allow public insert to tools" 
ON tools FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow all users to update tools (for testing)
CREATE POLICY "Allow public update to tools" 
ON tools FOR UPDATE 
TO public 
USING (true) 
WITH CHECK (true);

-- Allow all users to delete tools (for testing)
CREATE POLICY "Allow public delete from tools" 
ON tools FOR DELETE 
TO public 
USING (true);

-- Apply similar policies to related tables
-- attribute_types table
ALTER TABLE attribute_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to attribute_types" ON attribute_types;
CREATE POLICY "Allow public access to attribute_types" 
ON attribute_types FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);

-- attribute_values table  
ALTER TABLE attribute_values ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to attribute_values" ON attribute_values;
CREATE POLICY "Allow public access to attribute_values" 
ON attribute_values FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);

-- tool_attribute_links table
ALTER TABLE tool_attribute_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to tool_attribute_links" ON tool_attribute_links;
CREATE POLICY "Allow public access to tool_attribute_links" 
ON tool_attribute_links FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);

-- openness_assessments table
ALTER TABLE openness_assessments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to openness_assessments" ON openness_assessments;
CREATE POLICY "Allow public access to openness_assessments" 
ON openness_assessments FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);

-- assessment_dimensions table
ALTER TABLE assessment_dimensions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to assessment_dimensions" ON assessment_dimensions;
CREATE POLICY "Allow public access to assessment_dimensions" 
ON assessment_dimensions FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);

-- Note: These are very permissive policies suitable for development/testing
-- In production, you would want to restrict access based on authentication:
-- 
-- Example production policies:
-- CREATE POLICY "Allow authenticated users to insert tools" 
-- ON tools FOR INSERT 
-- TO authenticated 
-- WITH CHECK (auth.uid() = created_by);
--
-- CREATE POLICY "Allow users to update their own tools" 
-- ON tools FOR UPDATE 
-- TO authenticated 
-- USING (auth.uid() = created_by) 
-- WITH CHECK (auth.uid() = created_by);
