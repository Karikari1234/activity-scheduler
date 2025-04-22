"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ScheduleManager() {
  return (
    <div className="h-full p-md">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-heading font-bold text-text-primary mb-lg">Schedule Manager</h1>
        
        <div className="flex justify-between items-center mb-lg flex-wrap gap-md">
          <Button>
            Add New Schedule
          </Button>
          
          <div className="flex items-center gap-sm">
            <div className="flex items-center gap-sm">
              <label htmlFor="filterDate" className="text-text-secondary font-medium">Filter by Date:</label>
              <Input 
                type="date" 
                id="filterDate" 
                className="w-auto"
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 w-9 p-0" 
                title="Clear Filter"
              >
                ×
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-md">
          {/* Schedule list will go here */}
          <div className="bg-surface p-lg rounded-md shadow-sm text-center text-text-secondary">
            No schedules found. Add one to get started!
          </div>
        </div>
      </div>
    </div>
  );
}
