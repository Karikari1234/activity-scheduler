# Ticket 2.1: Setup schedules Table and Basic CRUD API

## Implementation Overview

This document outlines the implementation of Ticket 2.1, which establishes the core data structure and CRUD operations for schedule management in the Activity Scheduler application.

## Database Implementation

### Schedules Table Structure

The `schedules` table has been created with the following schema:

```sql
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  schedule_date DATE NOT NULL,
  time_range JSONB NOT NULL, -- {start: "HH:MM", end: "HH:MM"}
  place TEXT,
  activity TEXT,
  comment_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Indexing Strategy

B-tree indexes have been created to optimize common query patterns:

```sql
CREATE INDEX idx_schedules_user_id ON schedules(user_id);
CREATE INDEX idx_schedules_schedule_date ON schedules(schedule_date);
CREATE INDEX idx_schedules_user_date ON schedules(user_id, schedule_date);
```

### Row Level Security

RLS has been enabled with appropriate policies to ensure data security:

```sql
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own schedules" 
ON schedules FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own schedules" 
ON schedules FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedules" 
ON schedules FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schedules" 
ON schedules FOR DELETE
USING (auth.uid() = user_id);
```

## TypeScript Type Definitions

Type definitions for schedule data have been created in `src/types/schedule.ts`:

```typescript
export interface TimeRange {
  start: string; // "HH:MM" format
  end: string;   // "HH:MM" format
}

export interface Schedule {
  id: string;
  user_id: string;
  schedule_date: string; // ISO format date string YYYY-MM-DD
  time_range: TimeRange;
  place: string | null;
  activity: string | null;
  comment_link: string | null;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

export type NewSchedule = Omit<Schedule, 'id' | 'created_at' | 'updated_at'>;
export type UpdateSchedule = Partial<Omit<Schedule, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
```

## Server Actions Implementation

Server Actions have been implemented in `src/app/schedules/actions.ts` providing the following functionality:

### Create Schedule

```typescript
export async function createSchedule(formData: FormData)
```
- Creates a new schedule entry using form data
- Validates required fields
- Associates the schedule with the authenticated user
- Returns the created schedule data

### Read Schedules

```typescript
export async function getSchedules(params: ScheduleQueryParams = {})
```
- Fetches schedules for the authenticated user
- Supports filtering by date range
- Supports pagination with limit and offset
- Returns an array of schedule objects

```typescript
export async function getScheduleById(id: string)
```
- Fetches a specific schedule by ID
- Returns the schedule if it belongs to the authenticated user

### Update Schedule

```typescript
export async function updateSchedule(id: string, formData: FormData)
```
- Updates an existing schedule using form data
- Supports partial updates (only specified fields are changed)
- Validates user ownership of the schedule
- Returns the updated schedule

### Delete Schedule

```typescript
export async function deleteSchedule(id: string)
```
- Deletes a schedule by ID
- Validates user ownership of the schedule
- Returns success status

## Acceptance Criteria Fulfillment

The implementation satisfies all acceptance criteria for Ticket 2.1:

1. ✅ The schedules table exists in Supabase with all required columns
2. ✅ user_id correctly references auth.users.id with a foreign key constraint
3. ✅ Server Actions exist for creating, reading, updating, and deleting schedule entries
4. ✅ B-tree indexes are created on user_id and schedule_date

## Files Created

- `/src/app/schedules/schedules-table-setup.sql`: SQL script for table creation
- `/src/types/schedule.ts`: TypeScript type definitions
- `/src/app/schedules/actions.ts`: Server actions for CRUD operations
- `/src/app/schedules/README.md`: API usage documentation
