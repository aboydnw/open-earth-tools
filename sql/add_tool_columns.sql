-- SQL to add missing columns to your tools table
-- Run this in your Supabase SQL editor before running the migration

ALTER TABLE tools ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS embed_url text;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS embed_supported boolean DEFAULT false;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS icon text;

-- Optional: Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tools_embed_supported ON tools(embed_supported);
CREATE INDEX IF NOT EXISTS idx_tools_icon ON tools(icon);

-- Add check constraint for icon (emoji validation)
ALTER TABLE tools ADD CONSTRAINT check_icon_length CHECK (char_length(icon) <= 10);

-- Comments for documentation
COMMENT ON COLUMN tools.description IS 'Detailed description of the tool (1-2 sentences)';
COMMENT ON COLUMN tools.embed_url IS 'URL for iframe embedding (may differ from main URL)';
COMMENT ON COLUMN tools.embed_supported IS 'Whether the tool supports iframe embedding';
COMMENT ON COLUMN tools.icon IS 'Emoji icon representing the tool category';
