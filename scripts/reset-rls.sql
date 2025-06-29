-- Complete RLS Policy Reset for Open Earth Tools
-- Run this in your Supabase SQL Editor

-- First, disable RLS temporarily to clean up
ALTER TABLE tools DISABLE ROW LEVEL SECURITY;
ALTER TABLE attribute_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE attribute_values DISABLE ROW LEVEL SECURITY;
ALTER TABLE tool_attribute_links DISABLE ROW LEVEL SECURITY;
ALTER TABLE openness_assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_dimensions DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop policies on tools table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'tools') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON tools';
    END LOOP;
    
    -- Drop policies on attribute_types table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'attribute_types') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON attribute_types';
    END LOOP;
    
    -- Drop policies on attribute_values table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'attribute_values') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON attribute_values';
    END LOOP;
    
    -- Drop policies on tool_attribute_links table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'tool_attribute_links') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON tool_attribute_links';
    END LOOP;
    
    -- Drop policies on openness_assessments table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'openness_assessments') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON openness_assessments';
    END LOOP;
    
    -- Drop policies on assessment_dimensions table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'assessment_dimensions') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON assessment_dimensions';
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribute_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribute_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_attribute_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE openness_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_dimensions ENABLE ROW LEVEL SECURITY;

-- Create very permissive policies for development/testing
-- Tools table - allow everything
CREATE POLICY "dev_tools_all" ON tools FOR ALL TO public USING (true) WITH CHECK (true);

-- Attribute types - allow everything
CREATE POLICY "dev_attribute_types_all" ON attribute_types FOR ALL TO public USING (true) WITH CHECK (true);

-- Attribute values - allow everything
CREATE POLICY "dev_attribute_values_all" ON attribute_values FOR ALL TO public USING (true) WITH CHECK (true);

-- Tool attribute links - allow everything
CREATE POLICY "dev_tool_attribute_links_all" ON tool_attribute_links FOR ALL TO public USING (true) WITH CHECK (true);

-- Openness assessments - allow everything
CREATE POLICY "dev_openness_assessments_all" ON openness_assessments FOR ALL TO public USING (true) WITH CHECK (true);

-- Assessment dimensions - allow everything
CREATE POLICY "dev_assessment_dimensions_all" ON assessment_dimensions FOR ALL TO public USING (true) WITH CHECK (true);

-- Verify the policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('tools', 'attribute_types', 'attribute_values', 'tool_attribute_links', 'openness_assessments', 'assessment_dimensions')
ORDER BY tablename, policyname;
