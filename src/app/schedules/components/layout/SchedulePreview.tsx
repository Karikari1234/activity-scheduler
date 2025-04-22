"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ViewState = "default" | "full-preview" | "collapsed-preview";

interface SchedulePreviewProps {
  onViewStateChange: (state: ViewState) => void;
  currentViewState: ViewState;
}

export default function SchedulePreview({ onViewStateChange, currentViewState }: SchedulePreviewProps) {
  return (
    <div className="h-full p-md">
      <div className="flex justify-between items-center mb-lg pb-sm border-b border-divider">
        <h3 className="text-subtitle font-medium text-primary">Schedule Preview</h3>
        <div className="flex gap-xs">
          <Button 
            onClick={() => onViewStateChange("collapsed-preview")}
            variant="outline"
            size="sm"
            className={cn(
              "h-8 w-8 p-0", 
              currentViewState === "collapsed-preview" && "bg-primary-light border-primary text-primary"
            )}
            title="Collapse Preview"
          >
            ←
          </Button>
          <Button 
            onClick={() => onViewStateChange("default")}
            variant="outline"
            size="sm"
            className={cn(
              "h-8 w-8 p-0", 
              currentViewState === "default" && "bg-primary-light border-primary text-primary"
            )}
            title="Default View"
          >
            ⟷
          </Button>
          <Button 
            onClick={() => onViewStateChange("full-preview")}
            variant="outline"
            size="sm"
            className={cn(
              "h-8 w-8 p-0", 
              currentViewState === "full-preview" && "bg-primary-light border-primary text-primary"
            )}
            title="Full Preview"
          >
            →
          </Button>
        </div>
      </div>
      
      <div className="bg-surface p-lg rounded-md shadow-sm text-center">
        <p className="text-text-secondary italic">
          Select a date in the filter to see the preview.
        </p>
      </div>
      
      {/* Preview content will be rendered here */}
      <div id="previewContent" className="mt-md">
        {/* Will contain schedule table preview */}
      </div>
    </div>
  );
}
