# Schedule Layout - Technical Details

This document provides technical details about the implementation of the Schedule Layout system in the Activity Scheduler application.

## Component Structure

```
src/app/schedules/components/layout/
├── ScheduleLayout.tsx    # Main container component
├── ScheduleManager.tsx   # Left panel - schedule management
├── SchedulePreview.tsx   # Right panel - preview content
└── index.ts              # Exports for all components
```

## Component Relationships

```
┌─────────────────────────────────────────────────────────┐
│                    ScheduleLayout                       │
│                                                         │
│  ┌───────────────────────┐  ┌───────────────────────┐  │
│  │                       │  │                       │  │
│  │                       │  │                       │  │
│  │                       │  │                       │  │
│  │   ScheduleManager     │  │   SchedulePreview     │  │
│  │                       │  │                       │  │
│  │                       │  │                       │  │
│  │                       │  │                       │  │
│  │                       │  │                       │  │
│  └───────────────────────┘  └───────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## View State Logic

The view state is managed through React's useState hook in the ScheduleLayout component:

```typescript
const [viewState, setViewState] = useState<ViewState>("default");
```

This state is passed to the SchedulePreview component, which contains the controls to change the view state:

```typescript
<SchedulePreview 
  onViewStateChange={handleViewStateChange} 
  currentViewState={viewState} 
/>
```

When a user clicks one of the view toggle buttons, the state is updated, triggering a re-render with new CSS classes applied to the layout panels.

## CSS Implementation

The responsive layout is implemented using Tailwind CSS classes:

```tsx
<div className="flex w-full min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out">
  <div 
    className={`transition-all duration-300 ease-in-out overflow-y-auto ${
      viewState === "full-preview" ? "w-0 opacity-0 overflow-hidden" : 
      viewState === "collapsed-preview" ? "w-full" : "w-2/3"
    }`}
  >
    <ScheduleManager />
  </div>
  <div 
    className={`transition-all duration-300 ease-in-out bg-surface border-l border-divider overflow-y-auto ${
      viewState === "full-preview" ? "w-full" :
      viewState === "collapsed-preview" ? "w-0 opacity-0 overflow-hidden" : "w-1/3"
    }`}
  >
    <SchedulePreview />
  </div>
</div>
```

Key CSS features:
- **Flex Layout**: For side-by-side positioning
- **Dynamic Width**: Based on view state
- **Transitions**: For smooth animations
- **Overflow Management**: For scrolling within panels
- **Border Styling**: Visual separation between panels

## shadcn/ui Integration

The layout uses shadcn/ui components for consistency with the project's design system:

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Usage example
<Button 
  onClick={() => onViewStateChange("default")}
  variant="outline"
  size="sm"
  className={cn(
    "h-8 w-8 p-0", 
    currentViewState === "default" && "bg-primary-light border-primary text-primary"
  )}
>
  ⟷
</Button>
```

## Responsive Behavior

The layout is designed to be responsive:

1. **Large Screens**: Side-by-side panels with 2/3 - 1/3 split
2. **Medium Screens**: Side-by-side panels with adjusted proportions
3. **Small Screens**: Stacked panels (implementation pending in CSS media queries)

## Performance Considerations

1. **CSS Transitions**: Used instead of JavaScript animations for better performance
2. **Conditional Rendering**: Components remain mounted but hidden with CSS for smoother transitions
3. **State Management**: Simple useState to avoid unnecessary complexity for this UI feature

## Accessibility Features

1. **Semantic HTML**: Appropriate heading levels and structure
2. **Button Titles**: Tooltip information for icon-only buttons
3. **Focus Management**: Proper focus states via shadcn/ui components
4. **Keyboard Navigation**: Will be implemented in future iterations

## Future Technical Improvements

1. **Resize Observer**: For more dynamic panel resizing
2. **Media Query Hooks**: For better responsive behavior
3. **Context API**: If state management becomes more complex
4. **Keyboard Shortcut Integration**: For power users
