# Schedule Layout - Usage Guide

This guide provides practical instructions for working with and extending the Schedule Layout system in the Activity Scheduler application.

## Getting Started

### Viewing the Demo

To view the basic implementation:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the demo page:
   ```
   http://localhost:3000/schedules/layout-demo
   ```

3. Experiment with the view controls to see how the layout transitions between states.

### Using the Layout in a Page

To use the Schedule Layout in a page component:

```tsx
import { ScheduleLayout } from "@/app/schedules/components/layout";

export default function YourPage() {
  return (
    <div className="container mx-auto">
      <ScheduleLayout />
    </div>
  );
}
```

## Extending the Components

### Adding Schedule List to ScheduleManager

```tsx
// In ScheduleManager.tsx
import { useEffect, useState } from "react";
import { Schedule } from "@/types/schedule";
import { getSchedules } from "@/app/schedules/actions";

export default function ScheduleManager() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filterDate, setFilterDate] = useState<string>("");
  
  useEffect(() => {
    async function fetchSchedules() {
      try {
        const data = await getSchedules({ 
          startDate: filterDate, 
          endDate: filterDate 
        });
        setSchedules(data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    }
    
    fetchSchedules();
  }, [filterDate]);
  
  // Rest of the component
}
```

### Adding Schedule Preview Content

```tsx
// In SchedulePreview.tsx
import { Schedule } from "@/types/schedule";
import { RichTextDisplay } from "@/app/components/rich-text";

interface SchedulePreviewProps {
  // Existing props
  selectedSchedule?: Schedule;
}

export default function SchedulePreview({ 
  // Existing props
  selectedSchedule 
}: SchedulePreviewProps) {
  // Render preview content based on selectedSchedule
  return (
    <div className="h-full p-md">
      {/* Header with controls */}
      
      {selectedSchedule ? (
        <div className="bg-surface p-lg rounded-md shadow-sm">
          <h4 className="text-title font-semibold mb-md">
            {new Date(selectedSchedule.schedule_date).toLocaleDateString()}
          </h4>
          
          <div className="space-y-md">
            <div>
              <h5 className="text-subtitle font-medium mb-xs">Place</h5>
              <RichTextDisplay content={selectedSchedule.place} />
            </div>
            
            <div>
              <h5 className="text-subtitle font-medium mb-xs">Activity</h5>
              <RichTextDisplay content={selectedSchedule.activity} />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface p-lg rounded-md shadow-sm text-center">
          <p className="text-text-secondary italic">
            Select a schedule to see details
          </p>
        </div>
      )}
    </div>
  );
}
```

### Connecting the Components

To connect the ScheduleManager and SchedulePreview components:

```tsx
// In ScheduleLayout.tsx
import { useState } from "react";
import { Schedule } from "@/types/schedule";
import ScheduleManager from "./ScheduleManager";
import SchedulePreview from "./SchedulePreview";

type ViewState = "default" | "full-preview" | "collapsed-preview";

export default function ScheduleLayout() {
  const [viewState, setViewState] = useState<ViewState>("default");
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | undefined>();

  const handleViewStateChange = (newState: ViewState) => {
    setViewState(newState);
  };

  const handleScheduleSelect = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    // Optional: automatically show preview when selecting a schedule
    if (viewState === "collapsed-preview") {
      setViewState("default");
    }
  };

  return (
    <div className="flex w-full min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out">
      {/* ScheduleManager section */}
      <div className={/* existing classes */}>
        <ScheduleManager onScheduleSelect={handleScheduleSelect} />
      </div>
      
      {/* SchedulePreview section */}
      <div className={/* existing classes */}>
        <SchedulePreview 
          onViewStateChange={handleViewStateChange} 
          currentViewState={viewState}
          selectedSchedule={selectedSchedule}
        />
      </div>
    </div>
  );
}
```

## Adding PDF Generation

To add PDF generation to the SchedulePreview component:

```tsx
// In SchedulePreview.tsx
import { Button } from "@/components/ui/button";
import { Schedule } from "@/types/schedule";

interface SchedulePreviewProps {
  // Existing props
  schedulesForDate?: Schedule[];
  selectedDate?: string;
}

export default function SchedulePreview({
  // Existing props
  schedulesForDate,
  selectedDate
}: SchedulePreviewProps) {
  const handleGeneratePDF = () => {
    // PDF generation logic here
    // You can use jsPDF or another library
    console.log("Generating PDF for:", selectedDate);
  };
  
  return (
    <div className="h-full p-md">
      <div className="flex justify-between items-center mb-lg pb-sm border-b border-divider">
        <h3 className="text-subtitle font-medium text-primary">Schedule Preview</h3>
        <div className="flex items-center gap-sm">
          {selectedDate && schedulesForDate?.length > 0 && (
            <Button 
              size="sm" 
              onClick={handleGeneratePDF}
              className="mr-auto"
            >
              Download PDF
            </Button>
          )}
          
          {/* View control buttons */}
        </div>
      </div>
      
      {/* Preview content */}
    </div>
  );
}
```

## Customization Examples

### Custom Styling

```tsx
// Customize the layout proportions
<div 
  className={`transition-all duration-300 ease-in-out overflow-y-auto ${
    viewState === "full-preview" ? "w-0 opacity-0 overflow-hidden" : 
    viewState === "collapsed-preview" ? "w-full" : "w-3/4" // 3/4 instead of 2/3
  }`}
>
  <ScheduleManager />
</div>
```

### Add Toolbar to Preview Panel

```tsx
<div className="flex justify-between items-center mb-md">
  <h3 className="text-subtitle font-medium text-primary">Schedule Preview</h3>
  
  <div className="flex items-center gap-xs">
    {/* Add toolbar buttons */}
    <Button variant="outline" size="sm">
      <PrintIcon className="w-4 h-4" />
    </Button>
    <Button variant="outline" size="sm">
      <ShareIcon className="w-4 h-4" />
    </Button>
    
    {/* View control buttons */}
  </div>
</div>
```

## Common Patterns

### Responsive Adjustments

```tsx
// In media queries or className conditions
<div className="flex flex-col md:flex-row w-full">
  <div className={`
    w-full md:w-2/3
    ${viewState === "full-preview" ? "hidden md:w-0" : ""}
    ${viewState === "collapsed-preview" ? "w-full" : ""}
  `}>
    {/* Content */}
  </div>
</div>
```

### Loading States

```tsx
{isLoading ? (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
  </div>
) : (
  /* Actual content */
)}
```

## Best Practices

1. **Keep Panel Content Scrollable**: Always use `overflow-y-auto` on panel content to ensure it remains usable at any size

2. **Responsive Considerations**: Test the layout at various screen sizes to ensure usability

3. **Animation Performance**: Use `will-change` property for smoother transitions if needed

4. **Focus Management**: Ensure keyboard navigation works when panels change visibility

5. **State Management**: Consider moving state to a context provider if the component hierarchy becomes complex

## Troubleshooting

### Panel Resize Animation Issues

If panel resize animations are choppy:

```tsx
// Add will-change property
<div 
  className="transition-all duration-300 ease-in-out will-change-[width,opacity]"
>
  {/* Panel content */}
</div>
```

### Mobile Layout Stacking

If panels don't stack correctly on mobile:

```tsx
// Add explicit flex-direction control in parent
<div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-4rem)]">
  {/* Panels */}
</div>
```
