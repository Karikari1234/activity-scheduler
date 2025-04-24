"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScheduleFormModal } from "../components/modal";
import { Schedule } from "@/types/schedule";
import { RichTextDisplay } from "@/app/components/rich-text";

interface ScheduleManagerWithDataProps {
  schedules: Schedule[];
  onScheduleSelect: (schedule: Schedule) => void;
}

export default function ScheduleManagerWithData({ 
  schedules, 
  onScheduleSelect 
}: ScheduleManagerWithDataProps) {
  const [filterDate, setFilterDate] = useState<string>("");
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);

  // Initialize filtered schedules when component mounts or schedules change
  useEffect(() => {
    setFilteredSchedules(schedules);
  }, [schedules]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setFilterDate(date);
    
    if (date) {
      const filtered = schedules.filter(schedule => 
        schedule.schedule_date === date
      );
      setFilteredSchedules(filtered);
    } else {
      setFilteredSchedules(schedules);
    }
  };

  const handleFilterClear = () => {
    setFilterDate("");
    setFilteredSchedules(schedules);
  };

  const handleScheduleCreated = () => {
    // In a real app, this would refresh the schedule list
    // For demo purposes, we'll just show a notification
    alert("Schedule created successfully! Refresh the page to see the new schedule.");
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
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((schedule) => (
              <div 
                key={schedule.id} 
                className="bg-surface p-md rounded-md shadow-sm hover:shadow transition-shadow cursor-pointer"
                onClick={() => onScheduleSelect(schedule)}
              >
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-subtitle font-medium text-text-primary">
                      {new Date(schedule.schedule_date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </h2>
                    <p className="text-text-secondary">
                      {schedule.time_range.start} - {schedule.time_range.end}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-text-secondary">›</span>
                  </div>
                </div>
                
                <div className="mt-sm grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div>
                    <h3 className="text-sm font-medium text-text-secondary mb-xs">Place</h3>
                    <div className="line-clamp-2">
                      <RichTextDisplay content={schedule.place} />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-text-secondary mb-xs">Activity</h3>
                    <div className="line-clamp-2">
                      <RichTextDisplay content={schedule.activity} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-surface p-lg rounded-md shadow-sm text-center text-text-secondary">
              {filterDate ? 
                "No schedules found for the selected date." : 
                "No schedules found. Add one to get started!"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
