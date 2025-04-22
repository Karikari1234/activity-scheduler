# Schedule Modal Integration

This document outlines how the Schedule Form Modal integrates with the ScheduleManager component in the dual-pane layout system.

## Overview

The Schedule Form Modal has been designed to work seamlessly with the existing layout components. This integration provides a complete user interface for schedule management, combining:

1. The dual-pane layout for viewing schedules
2. The modal form for creating and editing schedules
3. The rich text functionality for detailed content

## Integration Components

### ScheduleManagerWithModal

A enhanced version of ScheduleManager that includes the Schedule Form Modal.

**Location**: `src/app/schedules/components/layout/ScheduleManagerWithModal.tsx`

**Features**:
- Integrates the Add Schedule button with the modal
- Handles date filtering
- Will display the list of schedules
- Provides success callback handling

## Usage Examples

### Basic Integration

```tsx
import { ScheduleManagerWithModal } from "@/app/schedules/components/layout";
import { SchedulePreview } from "@/app/schedules/components/layout";

export default function SchedulesPage() {
  return (
    <div className="flex w-full">
      <div className="w-2/3">
        <ScheduleManagerWithModal />
      </div>
      <div className="w-1/3 bg-surface border-l border-divider">
        <SchedulePreview 
          onViewStateChange={() => {}} 
          currentViewState="default" 
        />
      </div>
    </div>
  );
}
```

### With Layout Component

```tsx
import { ScheduleLayout } from "@/app/schedules/components/layout";
import { ScheduleManagerWithModal } from "@/app/schedules/components/layout";

export default function SchedulesPage() {
  return (
    <ScheduleLayout 
      managerComponent={<ScheduleManagerWithModal />}
    />
  );
}
```

## Demo Implementation

A complete demo of the integrated solution is available at `/schedules/integrated-demo` which shows:

- The dual-pane layout with ScheduleManagerWithModal in the left panel
- The SchedulePreview in the right panel
- The modal for adding new schedules
- The filtering functionality

## User Flow

1. User navigates to the schedules page
2. The dual-pane layout shows the schedule list on the left and preview on the right
3. User clicks "Add New Schedule" to open the modal
4. User fills the form and submits
5. The schedule list updates with the new entry
6. User can select a schedule from the list to see its details in the preview pane
7. User can edit a schedule by clicking the edit button on a schedule card

## State Management

The integration manages several states:

1. **Modal Open State**: Controls when the modal is visible
2. **Filter State**: Controls which schedules are displayed in the list
3. **Layout View State**: Controls the visibility of the panels in the layout
4. **Form State**: Manages the form values and validation in the modal

## Data Flow

1. **Create Flow**: 
   - User opens modal -> Fills form -> Submits
   - Server action creates the schedule
   - Success callback triggers list refresh
   - Modal closes

2. **Edit Flow**:
   - User clicks edit on a schedule -> Modal opens with pre-filled data
   - User edits fields -> Submits
   - Server action updates the schedule
   - Success callback triggers list refresh
   - Modal closes

## Implementation Notes

- The modal is conditionally rendered to avoid unnecessary DOM elements
- Form state is reset when the modal is closed
- Validation errors are displayed inline with the form fields
- The modal uses React's Portal to ensure proper stacking context
- Focus is properly managed for accessibility

## Future Enhancements

1. Add a centralized state management solution (like Zustand)
2. Implement optimistic UI updates
3. Add loading indicators during form submission
4. Implement server-side validation
5. Add pagination for the schedule list
