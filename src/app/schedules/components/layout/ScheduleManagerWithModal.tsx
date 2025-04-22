"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScheduleFormModal } from "../modal";

export default function ScheduleManagerWithModal() {
  const [filterDate, setFilterDate] = useState<string>("");

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDate(e.target.value);
  };

  const handleFilterClear = () => {
    setFilterDate("");
  };

  const handleScheduleCreated = () => {
    // Refresh the schedule list
    console.log("Schedule created successfully");
  };

  return (
    <div className="h-full p-md">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-heading font-bold text-text-primary mb-lg">Schedule Manager</h1>
        
        <div className="flex justify-between items-center mb-lg flex-wrap gap-md">
          {/* Add Schedule Button with Modal */}
          <ScheduleFormModal 
            trigger={<Button>Add New Schedule</Button>}
            onSuccess={handleScheduleCreated}
          />
          
          <div className="flex items-center gap-sm">
            <div className="flex items-center gap-sm">
              <label htmlFor="filterDate" className="text-text-secondary font-medium">Filter by Date:</label>
              <Input 
                type="date" 
                id="filterDate" 
                className="w-auto"
                value={filterDate}
                onChange={handleFilterChange}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 w-9 p-0" 
                title="Clear Filter"
                onClick={handleFilterClear}
                disabled={!filterDate}
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
