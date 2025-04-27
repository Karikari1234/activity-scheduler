# Zustand Stores for Schedule Management

This directory contains Zustand stores for managing schedule data and UI state in the Activity Scheduler application.

## Overview

The state management has been divided into two distinct stores:

1. `scheduleStore.ts` - Manages schedule data and operations
2. `scheduleUIStore.ts` - Manages UI-specific state like modal visibility

This separation of concerns makes the code more maintainable and follows best practices for state management.

## scheduleStore.ts

Manages all data-related aspects of schedules:

### State
- `schedules`: Array of Schedule objects
- `loading`: Boolean loading state
- `error`: Error message string or null
- `filterDate`: Currently applied date filter

### Actions
- `fetchSchedules(params?)`: Loads schedules with optional filtering
- `fetchScheduleById(id)`: Gets a specific schedule by ID
- `createSchedule(formData)`: Creates a new schedule
- `updateSchedule(id, formData)`: Updates an existing schedule
- `deleteSchedule(id)`: Deletes a schedule
- `setFilterDate(date)`: Sets the current filter date
- `clearError()`: Clears error messages
- `clearSchedules()`: Empties the schedules array

## scheduleUIStore.ts

Manages UI-specific state:

### State
- `isModalOpen`: Boolean for modal visibility
- `selectedSchedule`: Currently selected Schedule object or null
- `isEditMode`: Boolean for edit vs. create mode
- `viewState`: Layout view state ("default", "full-preview", or "collapsed-preview")

### Actions
- `openAddModal()`: Opens modal for adding a new schedule
- `openEditModal(schedule)`: Opens modal for editing a schedule
- `closeModal()`: Closes the modal
- `setViewState(state)`: Sets the layout view state
- `resetUI()`: Resets all UI state to defaults

## Usage Example

```tsx
import { useScheduleStore } from "@/stores/scheduleStore";
import { useScheduleUIStore } from "@/stores/scheduleUIStore";

function MyComponent() {
  // Get data state and actions
  const { 
    schedules, 
    loading, 
    fetchSchedules 
  } = useScheduleStore();
  
  // Get UI state and actions
  const { 
    isModalOpen, 
    openAddModal 
  } = useScheduleUIStore();
  
  // Use in components
  return (
    <div>
      <button onClick={openAddModal}>Add New Schedule</button>
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {schedules.map(schedule => (
            <li key={schedule.id}>{schedule.schedule_date}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Benefits

- **Centralized State Management**: Single source of truth for schedule data
- **Simpler Components**: Components can focus on presentation, not state logic
- **Better Developer Experience**: Easy to debug and trace state changes
- **Improved Performance**: Optimized rendering with selective state subscriptions
- **Maintainability**: Clear separation of concerns between data and UI state
