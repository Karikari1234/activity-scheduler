/* eslint-disable */
"use client";

import { useState, useCallback } from "react";
import ScheduleManager from "./ScheduleManager";
import SchedulePreview from "./SchedulePreview";
import { Schedule } from "@/types/schedule";
import { ScheduleFormModal } from "../modal";
import { Button } from "@/components/ui/button";

type ViewState = "default" | "full-preview" | "collapsed-preview";

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
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | undefined>(undefined);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

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
  
  // Modal handlers
  const handleOpenAddModal = useCallback(() => {
    setSelectedSchedule(undefined);
    setIsEditMode(false);
    setIsModalOpen(true);
  }, []);
  
  const handleOpenEditModal = useCallback((schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsEditMode(true);
    setIsModalOpen(true);
  }, []);
  
  const handleModalSuccess = useCallback(() => {
    // Refresh the schedules list
    console.log("Schedule created or updated successfully");
    // This would typically trigger a refresh of the schedules list
  }, []);

  return (
    <div className="flex w-full min-h-[calc(100vh-7rem)] transition-all duration-300 ease-in-out bg-gray-50">
      <div
        className={`transition-all duration-300 ease-in-out overflow-y-auto ${
          viewState === "full-preview"
            ? "w-0 opacity-0 overflow-hidden"
            : viewState === "collapsed-preview"
            ? "w-full"
            : "w-[60%]"
        }`}
      >
        {customManager ? (
          customManager
        ) : (
          <ScheduleManager 
            onDateChange={handleDateChange} 
            onSchedulesUpdate={updateFilteredSchedules}
            onAddSchedule={handleOpenAddModal}
            onEditSchedule={handleOpenEditModal}
          />
        )}
      </div>
      <div
        className={`transition-all duration-300 ease-in-out bg-white shadow-lg overflow-y-auto ${
          viewState === "full-preview"
            ? "w-full"
            : viewState === "collapsed-preview"
            ? "w-0 opacity-0 overflow-hidden"
            : "w-[40%]"
        }`}
      >
        <SchedulePreview
          onViewStateChange={handleViewStateChange}
          currentViewState={viewState}
          selectedDate={selectedDate}
          schedules={filteredSchedules}
        />
      </div>
      
      {/* Schedule Form Modal - loaded once in the layout */}
      <ScheduleFormModal
        isEdit={isEditMode}
        schedule={selectedSchedule}
        trigger={<Button className="hidden">Hidden Trigger</Button>}
        onSuccess={handleModalSuccess}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
