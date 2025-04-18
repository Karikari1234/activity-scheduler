# Schedules API Documentation

This document outlines the server actions available for managing schedule entries in the Activity Scheduler application.

## Database Schema

The `schedules` table has the following structure:

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

## API Endpoints (Server Actions)

### Create Schedule

Create a new schedule entry for the authenticated user.

```typescript
import { createSchedule } from "@/app/schedules/actions";

// Using with a form
<form action={createSchedule}>
  <input name="schedule_date" type="date" required />
  <input name="time_start" type="time" required />
  <input name="time_end" type="time" required />
  <input name="place" type="text" />
  <input name="activity" type="text" />
  <input name="comment_link" type="text" />
  <button type="submit">Create Schedule</button>
</form>
```

### Get Schedules

Fetch schedules for the authenticated user, with optional date range filtering.

```typescript
import { getSchedules } from "@/app/schedules/actions";

// Example: Get all schedules for a specific date range
const schedules = await getSchedules({
  startDate: "2025-01-01",
  endDate: "2025-01-31",
  limit: 10,
  offset: 0
});
```

### Get Schedule by ID

Fetch a single schedule by its ID.

```typescript
import { getScheduleById } from "@/app/schedules/actions";

// Example: Get a specific schedule
const schedule = await getScheduleById("some-uuid-here");
```

### Update Schedule

Update an existing schedule entry.

```typescript
import { updateSchedule } from "@/app/schedules/actions";

// Using with a form
<form action={(formData) => updateSchedule("schedule-id-here", formData)}>
  <input name="schedule_date" type="date" defaultValue={schedule.schedule_date} />
  <input name="time_start" type="time" defaultValue={schedule.time_range.start} />
  <input name="time_end" type="time" defaultValue={schedule.time_range.end} />
  <input name="place" type="text" defaultValue={schedule.place} />
  <input name="activity" type="text" defaultValue={schedule.activity} />
  <input name="comment_link" type="text" defaultValue={schedule.comment_link} />
  <button type="submit">Update Schedule</button>
</form>
```

### Delete Schedule

Delete a schedule entry by its ID.

```typescript
import { deleteSchedule } from "@/app/schedules/actions";

// Example: Delete a schedule
await deleteSchedule("schedule-id-here");

// Using with a form
<form action={() => deleteSchedule("schedule-id-here")}>
  <button type="submit">Delete Schedule</button>
</form>
```

## Data Types

The API uses the following TypeScript interfaces and types:

```typescript
interface TimeRange {
  start: string; // "HH:MM" format
  end: string;   // "HH:MM" format
}

interface Schedule {
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

type NewSchedule = Omit<Schedule, 'id' | 'created_at' | 'updated_at'>;
type UpdateSchedule = Partial<Omit<Schedule, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

interface ScheduleQueryParams {
  startDate?: string; // ISO format date YYYY-MM-DD
  endDate?: string;   // ISO format date YYYY-MM-DD
  limit?: number;
  offset?: number;
}
```

## Security

The API enforces Row Level Security (RLS) at the database level, ensuring that:

1. Users can only see their own schedules
2. Users can only create schedules for themselves
3. Users can only update their own schedules
4. Users can only delete their own schedules

Authentication is required for all API operations.

## Performance

The database uses B-tree indexes on:
- `user_id`
- `schedule_date`
- `(user_id, schedule_date)` (composite index)

These indexes optimize the common query patterns of fetching schedules by user and date range.
