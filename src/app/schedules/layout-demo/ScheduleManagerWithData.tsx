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
    <div className="h-full p-6 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-heading font-bold text-primary mb-8">Schedule Manager</h1>
        
        <div className="flex justify-between items-center mb-8 flex-wrap gap-md">
          {/* Add Schedule Button with Modal */}
          <ScheduleFormModal 
            trigger={<Button className="bg-primary text-white hover:bg-primary-dark font-medium shadow-sm">Add New Schedule</Button>}
            onSuccess={handleScheduleCreated}
          />
          
          <div className="flex items-center gap-sm rounded-md shadow-sm bg-surface p-1">
            <div className="flex items-center gap-sm">
              <label htmlFor="filterDate" className="text-text-secondary font-medium px-1">Filter by Date:</label>
              <div className="relative">
                <Input 
                  type="date" 
                  id="filterDate" 
                  className="w-auto border-divider focus:border-primary focus:ring-primary/20 shadow-inner"
                  value={filterDate}
                  onChange={handleFilterChange}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-full shadow-sm hover:shadow text-text-secondary" 
                title="Clear Filter"
                onClick={handleFilterClear}
                disabled={!filterDate}
              >
                ×
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-10">
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((schedule) => (
              <div 
                key={schedule.id} 
                className="bg-white p-0 rounded-md shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden group mb-8"
                onClick={() => onScheduleSelect(schedule)}
              >
                <div className="border-b border-gray-100 bg-gradient-to-r from-primary-light/30 to-transparent p-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-subtitle font-semibold text-primary">
                        {new Date(schedule.schedule_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </h2>
                      <p className="text-text-secondary font-medium mt-1">
                        {schedule.time_range.start} - {schedule.time_range.end}
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      <Button variant="outline" size="sm" className="text-primary border-primary/20 bg-white hover:bg-primary-light hover:text-primary p-1 h-8 w-8 rounded-full shadow-sm">
                        <span className="text-xl">›</span>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50/50 p-3 rounded-md">
                    <h3 className="text-sm font-medium text-primary uppercase tracking-wide mb-2">Venue</h3>
                    <div className="text-text-primary">
                      <RichTextDisplay content={schedule.place} />
                    </div>
                  </div>
                  
                  <div className="bg-gray-50/50 p-3 rounded-md">
                    <h3 className="text-sm font-medium text-primary uppercase tracking-wide mb-2">Agenda</h3>
                    <div className="text-text-primary">
                      <RichTextDisplay content={schedule.activity} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-md shadow-md text-center">
              <div className="py-8 px-4 text-center">
                {filterDate ? (
                  <>
                    <h3 className="text-lg font-medium text-gray-500 mb-2">No schedules found</h3>
                    <p className="text-text-secondary">
                      No meetings scheduled for {new Date(filterDate).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-gray-500 mb-2">No schedules yet</h3>
                    <p className="text-text-secondary mb-4">
                      Get started by creating your first schedule
                    </p>
                    <ScheduleFormModal 
                      trigger={<Button className="bg-primary text-white hover:bg-primary-dark font-medium shadow-sm">Add New Schedule</Button>}
                      onSuccess={handleScheduleCreated}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
