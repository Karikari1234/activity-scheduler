# Rich Text Editor Implementation (Ticket 2.2)

This document outlines the implementation of rich text editing for the 'Place' and 'Activity' fields in the Activity Scheduler application.

## Overview

Ticket 2.2 required the integration of a rich text editor (RTE) for the 'Place' and 'Activity' fields in the schedule creation/edit form. The implementation uses Tiptap, a headless editor framework, and stores the content as JSONB in the PostgreSQL database via Supabase.

## Implementation Details

### 1. Database Changes

The 'place' and 'activity' columns in the schedules table have been converted from TEXT to JSONB:

```sql
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
```

GIN indexes have been added for efficient searching:

```sql
CREATE INDEX idx_schedules_place ON schedules USING GIN (place);
CREATE INDEX idx_schedules_activity ON schedules USING GIN (activity);
```

### 2. TypeScript Types

The Schedule interface has been updated to use RichTextContent types for 'place' and 'activity':

```typescript
export interface RichTextContent {
  type: 'doc';
  content: Array<ParagraphNode | BulletListNode | OrderedListNode>;
}

export interface Schedule {
  // ...existing fields
  place: RichTextContent | null;
  activity: RichTextContent | null;
  // ...existing fields
}
```

### 3. Rich Text Editor Components

Three main components have been created:

- `RichTextEditor`: The main editor component with editing capabilities
- `RichTextDisplay`: A read-only component for displaying rich text content
- `EditorToolbar`: Provides formatting buttons (bold, italic, lists)

### 4. Server Actions

The server actions have been updated to handle JSONB data:

- `createSchedule`: Parses and validates rich text content before storing
- `updateSchedule`: Handles JSONB data for place and activity fields
- `getScheduleById` and `getSchedules`: Return properly typed data

### 5. Form Integration

The schedule form now integrates the rich text editor components:

```tsx
<div className="space-y-sm">
  <label htmlFor="place" className="block text-text-primary font-medium">
    Place
  </label>
  <RichTextEditor
    id="place"
    name="place"
    content={placeContent}
    onChange={setPlaceContent}
    placeholder="Enter place details..."
  />
</div>
```

### 6. Styling

Custom CSS has been added to style the rich text content in both editing and display modes.

## Security Considerations

The implementation includes several security measures:

1. **Input Validation**: The rich text content is parsed and validated before storing
2. **Structure Validation**: Only valid document structure is accepted
3. **JSON Parsing**: Safe JSON parsing to prevent injection attacks
4. **Tiptap Sanitization**: Tiptap provides built-in sanitization for most XSS vectors

## Installation Requirements

To use the rich text editor functionality, the following packages need to be installed:

```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit
```

## Usage Examples

### Creating a Schedule with Rich Text

```tsx
// In a form component
const [placeContent, setPlaceContent] = useState<RichTextContent | null>(null);

// In JSX
<RichTextEditor
  id="place"
  name="place"
  content={placeContent}
  onChange={setPlaceContent}
  placeholder="Enter place details..."
/>
```

### Displaying Rich Text Content

```tsx
<RichTextDisplay content={schedule.place} />
```

## Testing

To test the rich text functionality:

1. Navigate to the schedule creation page
2. Enter text in the 'Place' or 'Activity' fields
3. Use the toolbar to format text (bold, italic, lists)
4. Submit the form
5. Verify the formatted text appears correctly on the detail page
6. Edit the schedule and confirm the formatting is preserved

## Future Enhancements

Potential improvements for the rich text editor:

1. Add more formatting options (headings, links, etc.)
2. Implement more advanced features like tables or code blocks
3. Add image upload functionality
4. Implement full-text search on the JSONB content
