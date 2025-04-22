# Schedule Form Modal

This document outlines the implementation of the Schedule Form Modal for the Activity Scheduler application.

## Overview

The Schedule Form Modal provides a user-friendly interface for creating and editing schedules. It includes specialized components for date selection, time range selection, and rich text editing for place and activity information.

## Components

### 1. ScheduleFormModal

The main component that renders a modal dialog with a form for creating or editing schedules.

**Location**: `src/app/schedules/components/modal/ScheduleFormModal.tsx`

**Features**:
- Modal dialog with appropriate headers and actions
- Form validation for required fields
- Support for both create and edit modes
- Integration with existing server actions
- Rich text editing for place and activity fields

**Props**:
- `schedule?`: Optional schedule object for edit mode
- `isEdit?`: Boolean to toggle between create and edit modes
- `trigger`: ReactNode that will trigger the modal when clicked
- `onSuccess?`: Optional callback function when form is successfully submitted

### 2. TimeRangePicker

A specialized component for selecting a time range (start time and end time).

**Location**: `src/app/schedules/components/modal/TimeRangePicker.tsx`

**Features**:
- Hours and minutes selection for both start and end times
- Keyboard navigation between fields
- Compact, intuitive interface

**Props**:
- `startDate`: Date object for start time
- `endDate`: Date object for end time
- `setStartDate`: Function to update start time
- `setEndDate`: Function to update end time
- `className?`: Optional CSS class name

### 3. DatePickerWithCalendar

A component for selecting a date using a calendar dropdown.

**Location**: `src/app/schedules/components/modal/DatePickerWithCalendar.tsx`

**Features**:
- Calendar dropdown for visual date selection
- Formatted date display
- Keyboard navigation

**Props**:
- `date`: Selected date
- `setDate`: Function to update the date
- `className?`: Optional CSS class name

## Integration

The modal system integrates with:

1. **Server Actions**: Uses existing `createSchedule` and `updateSchedule` functions
2. **Rich Text Editor**: Uses the existing `RichTextEditor` component for place and activity fields
3. **shadcn/ui Components**: Uses Dialog, Form, Button, Input, and other shadcn/ui components

## Usage

### Basic Usage

```tsx
import { Button } from "@/components/ui/button";
import { ScheduleFormModal } from "@/app/schedules/components/modal";

export default function YourComponent() {
  return (
    <ScheduleFormModal 
      trigger={<Button>Add Schedule</Button>}
      onSuccess={() => {
        // Do something after successful submission
      }}
    />
  );
}
```

### Edit Mode

```tsx
import { Button } from "@/components/ui/button";
import { ScheduleFormModal } from "@/app/schedules/components/modal";

export default function YourComponent({ schedule }) {
  return (
    <ScheduleFormModal 
      isEdit={true}
      schedule={schedule}
      trigger={<Button variant="outline">Edit</Button>}
      onSuccess={() => {
        // Do something after successful update
      }}
    />
  );
}
```

## Form Validation

The form validates:

1. **Date**: Required field
2. **Time Range**: 
   - Both start and end times are required
   - End time must be after start time
3. **Place**: Required field with rich text
4. **Activity**: Required field with rich text
5. **Comment Link**: Optional URL field

## Accessibility

The modal implementation includes:

- Keyboard navigation support
- Proper focus management
- Semantic HTML structure
- Appropriate ARIA attributes via shadcn/ui components
- Error messages for screen readers

## Mobile Considerations

The modal is fully responsive:
- Properly sized inputs for touch devices
- Stacked layout on small screens
- Native date/time inputs compatible with mobile devices

## Demo

A demo page is available at `/schedules/modal-demo` that showcases:
- Creating a new schedule
- Editing an existing schedule

## Future Enhancements

1. Add support for recurring schedules
2. Implement more advanced validation rules
3. Add attachments or file uploads
4. Integrate with a calendar view
