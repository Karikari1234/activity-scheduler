-- Migration script to convert place and activity columns to JSONB
-- and add GIN indexes for better performance

-- First, alter the columns to JSONB type
-- For place column
ALTER TABLE schedules 
  ALTER COLUMN place TYPE JSONB USING 
    CASE 
      WHEN place IS NULL THEN NULL
      ELSE jsonb_build_object('type', 'doc', 'content', jsonb_build_array(
        jsonb_build_object(
          'type', 'paragraph',
          'content', CASE WHEN place = '' THEN NULL ELSE jsonb_build_array(jsonb_build_object('type', 'text', 'text', place)) END
        )
      ))
    END;

-- For activity column
ALTER TABLE schedules 
  ALTER COLUMN activity TYPE JSONB USING 
    CASE 
      WHEN activity IS NULL THEN NULL
      ELSE jsonb_build_object('type', 'doc', 'content', jsonb_build_array(
        jsonb_build_object(
          'type', 'paragraph',
          'content', CASE WHEN activity = '' THEN NULL ELSE jsonb_build_array(jsonb_build_object('type', 'text', 'text', activity)) END
        )
      ))
    END;

-- Add GIN indexes for efficient searching
CREATE INDEX IF NOT EXISTS idx_schedules_place ON schedules USING GIN (place);
CREATE INDEX IF NOT EXISTS idx_schedules_activity ON schedules USING GIN (activity);

-- Comment for documentation
COMMENT ON COLUMN schedules.place IS 'Rich text content for place stored as JSONB';
COMMENT ON COLUMN schedules.activity IS 'Rich text content for activity stored as JSONB';
