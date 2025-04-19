# Rich Text Editor Documentation

This document provides an overview of the rich text editor components implemented for the Activity Scheduler application.

## Overview

The rich text editor implementation is built using Tiptap, a headless editor framework for the web. It provides rich text editing capabilities for the 'Place' and 'Activity' fields in the schedule forms.

## Key Components

### 1. RichTextEditor

The main editor component that provides editing capabilities with a toolbar for formatting options.

```tsx
import { RichTextEditor } from '@/app/components/rich-text';

// Usage in a form
<RichTextEditor
  id="place"
  name="place"
  content={placeContent}
  onChange={setPlaceContent}
  placeholder="Enter place details..."
/>
```

Props:
- `content`: The rich text content as a JSON object
- `onChange`: Callback function when content changes
- `placeholder`: Placeholder text to display when empty
- `readOnly`: Boolean flag to set the editor to read-only mode
- `id`: HTML id attribute
- `name`: Form field name

### 2. RichTextDisplay

A component for displaying rich text content in read-only mode.

```tsx
import { RichTextDisplay } from '@/app/components/rich-text';

// Usage in a display component
<RichTextDisplay content={schedule.place} />
```

Props:
- `content`: The rich text content as a JSON object
- `className`: Additional CSS classes

### 3. EditorToolbar

The toolbar component that provides formatting buttons for the editor.

## Data Format

The rich text content is stored as JSONB in the database, with a structure similar to:

```json
{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Sample text"
        }
      ]
    }
  ]
}
```

## Features

- Bold and italic text formatting
- Bullet lists (unordered lists)
- Numbered lists (ordered lists)
- Persistent content storage in JSONB format
- Input sanitization to prevent XSS attacks

## Implementation Notes

1. The editor uses client components with the "use client" directive since it requires browser APIs
2. The content is stored in PostgreSQL as JSONB, which is more efficient for storing structured data
3. GIN indexes are added to the JSONB columns for efficient searching
4. The editor handles sanitization of input to prevent XSS attacks

## Database Structure

The 'place' and 'activity' columns in the schedules table are defined as JSONB data type:

```sql
ALTER TABLE schedules 
  ALTER COLUMN place TYPE JSONB;
  
ALTER TABLE schedules 
  ALTER COLUMN activity TYPE JSONB;
```

GIN indexes are created for efficient querying:

```sql
CREATE INDEX idx_schedules_place ON schedules USING GIN (place);
CREATE INDEX idx_schedules_activity ON schedules USING GIN (activity);
```
