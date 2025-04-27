/* eslint-disable */
"use client";

import { useEffect } from "react";
import ScheduleManager from "./ScheduleManager";
import SchedulePreview from "./SchedulePreview";
import { Schedule } from "@/types/schedule";
import { ScheduleFormModal } from "../modal";
import { Button } from "@/components/ui/button";
import { useScheduleStore } from "@/stores/scheduleStore";
import { useScheduleUIStore } from "@/stores/scheduleUIStore";

export default function ScheduleLayout({
  children,
  customManager,
}: {
  children?: React.ReactNode;
  customManager?: React.ReactNode;
}) {
  // Get state and actions from Zustand stores
  const { schedules, fetchSchedules, setFilterDate, filterDate } =
    useScheduleStore();

  const {
    viewState,
    setViewState,
    isModalOpen,
    selectedSchedule,
    isEditMode,
    openAddModal,
    openEditModal,
    closeModal,
  } = useScheduleUIStore();

  // Load schedules on mount and when filterDate changes
  useEffect(() => {
    if (filterDate) {
      fetchSchedules({
        startDate: filterDate,
        endDate: filterDate,
      });
    } else {
      fetchSchedules({ limit: 20 });
    }
  }, [filterDate, fetchSchedules]);

  // Handle date changes from child components
  const handleDateChange = (date: string | undefined) => {
    setFilterDate(date || null);
  };

  // Handle modal success (schedule created or updated)
  const handleModalSuccess = () => {
    // Refresh schedules after successful operation
    if (filterDate) {
      fetchSchedules({
        startDate: filterDate,
        endDate: filterDate,
      });
    } else {
      fetchSchedules({ limit: 20 });
    }
  };

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
          <ScheduleManager onDateChange={handleDateChange} />
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
          onViewStateChange={setViewState}
          currentViewState={viewState}
          selectedDate={filterDate || undefined}
          schedules={schedules}
        />
      </div>

      {/* Schedule Form Modal - loaded once in the layout */}
      <ScheduleFormModal
        isEdit={isEditMode}
        schedule={selectedSchedule || undefined}
        trigger={<Button className="hidden">Hidden Trigger</Button>}
        onSuccess={handleModalSuccess}
        open={isModalOpen}
        onOpenChange={closeModal}
      />
    </div>
  );
}
