-- Schedules Table Setup for Activity Scheduler
-- This script creates the schedules table, sets up indexes, and configures row level security

-- Create the schedules table
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  schedule_date DATE NOT NULL,
  time_range JSONB NOT NULL, -- Store as {start: "HH:MM", end: "HH:MM"}
  place TEXT,
  activity TEXT,
  comment_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create B-tree indexes for performance
CREATE INDEX idx_schedules_user_id ON schedules(user_id);
CREATE INDEX idx_schedules_schedule_date ON schedules(schedule_date);
CREATE INDEX idx_schedules_user_date ON schedules(user_id, schedule_date); -- Composite index for common query pattern

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at timestamp
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON schedules
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Create policies for CRUD operations
-- Allow users to read only their own schedules
CREATE POLICY "Users can view their own schedules" 
ON schedules FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to insert their own schedules
CREATE POLICY "Users can create their own schedules" 
ON schedules FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own schedules
CREATE POLICY "Users can update their own schedules" 
ON schedules FOR UPDATE
USING (auth.uid() = user_id);

-- Allow users to delete their own schedules
CREATE POLICY "Users can delete their own schedules" 
ON schedules FOR DELETE
USING (auth.uid() = user_id);
