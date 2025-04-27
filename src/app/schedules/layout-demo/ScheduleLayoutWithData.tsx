"use client";

import { useState } from "react";
import ScheduleManagerWithData from "./ScheduleManagerWithData";
import SchedulePreview from "../components/layout/SchedulePreview";
import ScheduleDetail from "../components/ScheduleDetail";
import { Schedule } from "@/types/schedule";

interface ScheduleLayoutWithDataProps {
  schedules: Schedule[];
}

export function ScheduleLayoutWithData({ schedules }: ScheduleLayoutWithDataProps) {
  const [viewState, setViewState] = useState<"default" | "full-preview" | "collapsed-preview">("default");
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const handleViewStateChange = (newState: "default" | "full-preview" | "collapsed-preview") => {
    setViewState(newState);
  };

  const handleScheduleSelect = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
  };

  return (
    <div className="flex w-full min-h-[calc(100vh-10rem)] transition-all duration-300 ease-in-out bg-background">
      <div
        className={`transition-all duration-300 ease-in-out overflow-y-auto ${
          viewState === "full-preview"
            ? "w-0 opacity-0 overflow-hidden"
            : viewState === "collapsed-preview"
            ? "w-full"
            : "w-2/3"
        }`}
      >
        <ScheduleManagerWithData 
          schedules={schedules} 
          onScheduleSelect={handleScheduleSelect} 
        />
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
        <div className="p-md">
          <SchedulePreview
            onViewStateChange={handleViewStateChange}
            currentViewState={viewState}
          />
          {selectedSchedule && (
            <div className="mt-md">
              <ScheduleDetail schedule={selectedSchedule} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
