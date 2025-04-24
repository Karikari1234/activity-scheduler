/* eslint-disable */
"use client";

import { useState, useCallback } from "react";
import ScheduleManager from "./ScheduleManager";
import SchedulePreview from "./SchedulePreview";

type ViewState = "default" | "full-preview" | "collapsed-preview";

// Define the Schedule type based on your actual data structure
// This should match your actual data model
interface Schedule {
  id: string;
  schedule_date: string;
  time_range: {
    start: string;
    end: string;
  };
  place: any; // Rich text content
  activity: any; // Rich text content
  comment_link?: string;
}

export default function ScheduleLayout({
  children,
  customManager,
}: {
  children?: React.ReactNode;
  customManager?: React.ReactNode;
}) {
  const [viewState, setViewState] = useState<ViewState>("default");
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);

  const handleViewStateChange = useCallback((newState: ViewState) => {
    setViewState(newState);
  }, []);

  const handleDateChange = useCallback((date: string | undefined) => {
    setSelectedDate(date);
  }, []);

  // Use useCallback to prevent recreation of this function on each render
  const updateFilteredSchedules = useCallback((schedules: Schedule[]) => {
    setFilteredSchedules(schedules);
  }, []);

  return (
    <div className="flex w-full min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out">
      <div
        className={`transition-all duration-300 ease-in-out overflow-y-auto ${
          viewState === "full-preview"
            ? "w-0 opacity-0 overflow-hidden"
            : viewState === "collapsed-preview"
            ? "w-full"
            : "w-2/3"
        }`}
      >
        {customManager ? (
          customManager
        ) : (
          <ScheduleManager onDateChange={handleDateChange} onSchedulesUpdate={updateFilteredSchedules} />
        )}
      </div>
      <div
        className={`transition-all duration-300 ease-in-out bg-surface border-l border-divider overflow-y-auto ${
          viewState === "full-preview"
            ? "w-full"
            : viewState === "collapsed-preview"
            ? "w-0 opacity-0 overflow-hidden"
            : "w-1/3"
        }`}
      >
        <SchedulePreview
          onViewStateChange={handleViewStateChange}
          currentViewState={viewState}
          selectedDate={selectedDate}
          schedules={filteredSchedules}
        />
      </div>
    </div>
  );
}
