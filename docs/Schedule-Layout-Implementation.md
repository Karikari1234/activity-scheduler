# Schedule Layout System

This document outlines the implementation of the dual-pane layout system for the Schedule Management feature of the Activity Scheduler application.

## Overview

The Schedule Layout system provides a flexible, responsive interface with a dual-pane layout that allows users to:

1. Manage their schedules in the left panel
2. Preview schedule information in the right panel
3. Adjust the layout to focus on either panel as needed

The implementation is inspired by modern document editors that provide simultaneous editing and preview capabilities.

## Component Architecture

### Core Components

1. **ScheduleLayout** (`src/app/schedules/components/layout/ScheduleLayout.tsx`)
   - Container component that manages the overall layout
   - Controls view state transitions between different layout modes
   - Handles responsive behavior

2. **ScheduleManager** (`src/app/schedules/components/layout/ScheduleManager.tsx`)
   - Left panel component for schedule management
   - Contains controls for adding and filtering schedules
   - Will house the schedule list and forms

3. **SchedulePreview** (`src/app/schedules/components/layout/SchedulePreview.tsx`)
   - Right panel component for previewing schedules
   - Contains view state toggle controls
   - Will display the selected schedule information or PDF preview

4. **Index Export** (`src/app/schedules/components/layout/index.ts`)
   - Exports all layout components for easy importing

### View States

The layout system supports three distinct view states:

1. **Default (Half/Half)**: Both panels visible, with manager taking 2/3 and preview taking 1/3
2. **Full Preview**: Schedule manager hidden, preview expanded to full width
3. **Collapsed Preview**: Preview hidden, schedule manager expanded to full width

## Usage

### Basic Integration

To use the Schedule Layout system in a page:

```tsx
import { ScheduleLayout } from "@/app/schedules/components/layout";

export default function SchedulesPage() {
  return (
    <div className="container mx-auto">
      <ScheduleLayout />
    </div>
  );
}
```

A demo page is available at `/schedules/layout-demo` to demonstrate the layout functionality.

### Component Integration

The layout components are designed to be extended with additional functionality:

- The ScheduleManager component will be integrated with the CRUD operations for schedules
- The SchedulePreview component will be extended to display schedule details and PDF previews
- Both components are built with shadcn/ui to ensure consistent styling

## Technology Stack

- **React**: Functional components with hooks for state management
- **TypeScript**: Type-safe component props and state
- **Tailwind CSS**: Styling using the project's design system
- **shadcn/ui**: UI component library for buttons and form elements
- **CSS Transitions**: Smooth animations between view states

## Styling Guidelines

The layout system follows the project's established styling patterns:

- **Colors**: Uses the color variables defined in the project's Tailwind config
- **Typography**: Consistent font sizes and weights based on the project's design system
- **Spacing**: Uses the project's spacing scale (`p-md`, `gap-sm`, etc.)
- **Components**: Leverages shadcn/ui components for consistent UI elements

## Responsive Design

The layout adapts to different screen sizes:

- **Desktop**: Full dual-pane layout with resizable panels
- **Tablet**: Maintains dual-pane layout with adjusted proportions
- **Mobile**: Stacks panels vertically when width is insufficient

## Future Enhancements

1. **State Persistence**: Remember user's preferred view state
2. **Resizable Panels**: Allow users to drag and resize panels
3. **Keyboard Shortcuts**: Toggle between view states using keyboard shortcuts
4. **Animation Refinements**: Add more subtle animations for improved UX

## Integration with Existing Features

The Schedule Layout system will integrate with:

1. **Schedule CRUD Operations**: Using existing server actions
2. **Rich Text Editor**: For schedule details
3. **PDF Generation**: For exporting schedules
4. **Authentication**: Ensuring only authenticated users can access schedules

## Implementation Notes

- The layout uses CSS transitions for smooth animations between states
- View state is managed with React useState to simplify state management
- Tailwind classes are conditionally applied based on the current view state
- shadcn/ui Button and Input components are used for consistency with the project's UI
