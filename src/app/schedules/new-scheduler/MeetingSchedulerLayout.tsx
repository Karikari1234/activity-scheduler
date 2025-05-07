/* eslint-disable */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import MeetingManagerPanel from "./MeetingManagerPanel";
import PDFPreviewPanel from "./PDFPreviewPanel";
import { format, parse, isValid } from "date-fns";
import { useScheduleStore } from "@/stores/scheduleStore";
import { useScheduleUIStore } from "@/stores/scheduleUIStore";
import { scheduleToMeetingUI, MeetingUI, convertToISODate, prepareMeetingFormData } from "./utils/dataConverters";
import { useToast } from "./contexts/ToastContext";

// Main layout component
const MeetingSchedulerLayout = () => {
  // Get toast context
  const { showToast } = useToast();
  
  // Get state and actions from scheduleStore
  const { 
    schedules,
    loading,
    error,
    filterDate: storeFilterDate,
    fetchSchedules, 
    createSchedule, 
    updateSchedule, 
    deleteSchedule,
    setFilterDate,
    clearError
  } = useScheduleStore();
  
  // Get view state management from UI store
  const { 
    viewState,
    setViewState
  } = useScheduleUIStore();
  
  // Local state for derived/processed data
  const [localFilterDate, setLocalFilterDate] = useState<string>("05/07/2025");
  const [meetings, setMeetings] = useState<MeetingUI[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<MeetingUI[]>([]);
  const [formattedSelectedDate, setFormattedSelectedDate] = useState<string>("May 7, 2025");
  
  // Sync store filter date with local state when needed
  useEffect(() => {
    if (storeFilterDate) {
      // Convert ISO date format to MM/DD/YYYY for local state
      const dateObj = new Date(storeFilterDate);
      if (isValid(dateObj)) {
        setLocalFilterDate(format(dateObj, "MM/dd/yyyy"));
      }
    }
  }, [storeFilterDate]);
  
  // Fetch schedules when filter date changes in the store
  useEffect(() => {
    if (storeFilterDate) {
      fetchSchedules({
        startDate: storeFilterDate,
        endDate: storeFilterDate
      });
    } else {
      fetchSchedules({ limit: 20 });
    }
  }, [storeFilterDate, fetchSchedules]);
  
  // Convert backend schedules to UI meetings format
  useEffect(() => {
    if (!schedules) return;
    
    // Convert backend data to frontend format
    const uiMeetings = Array.isArray(schedules) ? schedules.map(scheduleToMeetingUI) : [];
    console.log('Converted UI meetings:', uiMeetings);
    setMeetings(uiMeetings);
  }, [schedules]);
  
  // Convert local filter date to ISO and update store when changed
  const handleFilterDateChange = useCallback((date: string) => {
    setLocalFilterDate(date);
    
    if (date) {
      // Convert to ISO format and update store
      const isoDate = convertToISODate(date);
      setFilterDate(isoDate);
    } else {
      setFilterDate(null);
    }
  }, [setFilterDate]);

  // Filter meetings when filterDate changes
  useEffect(() => {
    if (!localFilterDate) {
      // If no filter date, show all meetings
      setFilteredMeetings(meetings);
      setFormattedSelectedDate("");
      return;
    }

    try {
      // Parse the filter date (MM/DD/YYYY) to a Date object
      const dateObj = parse(localFilterDate, "MM/dd/yyyy", new Date());

      if (isValid(dateObj)) {
        // Format the date in the display format for the PDF preview
        const formattedDate = format(dateObj, "MMMM d, yyyy");
        setFormattedSelectedDate(formattedDate);

        // Filter the meetings to only include those on the selected date
        const filtered = meetings.filter(
          (meeting) => meeting.date === formattedDate
        );
        setFilteredMeetings(filtered);
      }
    } catch (error) {
      console.error("Failed to parse date", error);
      setFilteredMeetings([]);
      showToast("Failed to parse date format", "error");
    }
  }, [localFilterDate, meetings, showToast]);

  // Handler for adding a new meeting
  const handleAddMeeting = async (meetingData: Partial<MeetingUI>) => {
    try {
      clearError();
      
      // Prepare form data for backend
      const formData = prepareMeetingFormData(meetingData);
      
      // Create the schedule in backend
      const newSchedule = await createSchedule(formData);
      
      // Success notification
      if (newSchedule) {
        showToast("Meeting created successfully", "success");
      }
      
      return true;
    } catch (err) {
      console.error("Failed to add meeting:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to add meeting";
      showToast(errorMessage, "error");
      return false;
    }
  };
  
  // Handler for updating an existing meeting
  const handleUpdateMeeting = async (id: string, meetingData: Partial<MeetingUI>) => {
    try {
      clearError();
      
      // Prepare form data for backend
      const formData = prepareMeetingFormData(meetingData);
      
      // Update the schedule in backend
      const updatedSchedule = await updateSchedule(id, formData);
      
      // Success notification
      if (updatedSchedule) {
        showToast("Meeting updated successfully", "success");
      }
      
      return true;
    } catch (err) {
      console.error("Failed to update meeting:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to update meeting";
      showToast(errorMessage, "error");
      return false;
    }
  };
  
  // Handler for deleting a meeting
  const handleDeleteMeeting = async (id: string) => {
    try {
      clearError();
      
      // Delete the schedule from backend
      const success = await deleteSchedule(id);
      
      // Success notification
      if (success) {
        showToast("Meeting deleted successfully", "success");
      }
      
      return true;
    } catch (err) {
      console.error("Failed to delete meeting:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to delete meeting";
      showToast(errorMessage, "error");
      return false;
    }
  };
  
  // Handler for managing meetings (add, update, delete)
  const handleUpdateMeetings = {
    add: handleAddMeeting,
    update: handleUpdateMeeting,
    delete: handleDeleteMeeting
  };

  // Handler for manually refreshing meetings data
  const handleRefresh = useCallback(() => {
    const isoDate = storeFilterDate || (localFilterDate ? convertToISODate(localFilterDate) : null);
    if (isoDate) {
      fetchSchedules({
        startDate: isoDate,
        endDate: isoDate
      }).then(() => {
        showToast("Meetings data refreshed", "info");
      });
    } else {
      fetchSchedules({ limit: 20 }).then(() => {
        showToast("Meetings data refreshed", "info");
      });
    }
  }, [localFilterDate, storeFilterDate, fetchSchedules, showToast]);

  return (
    <div className="flex w-full min-h-[calc(100vh-10rem)] border border-divider rounded-md overflow-hidden shadow-sm">
      {/* Left panel - Meeting Manager (2/3 width) */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          viewState === "full-preview"
            ? "w-0 opacity-0 overflow-hidden"
            : viewState === "collapsed-preview"
            ? "w-full"
            : "w-2/3"
        }`}
      >
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error}
          </div>
        )}
        
        <MeetingManagerPanel
          filterDate={localFilterDate}
          setFilterDate={handleFilterDateChange}
          meetings={filteredMeetings}
          updateMeetings={handleUpdateMeetings}
          loading={loading}
          onRefresh={handleRefresh}
        />
      </div>

      {/* Right panel - PDF Preview (1/3 width) */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          viewState === "full-preview"
            ? "w-full"
            : viewState === "collapsed-preview"
            ? "w-0 opacity-0 overflow-hidden"
            : "w-1/3"
        } bg-surface border-l border-divider`}
      >
        <PDFPreviewPanel
          selectedDate={formattedSelectedDate}
          meetings={filteredMeetings}
          setViewState={setViewState}
          viewState={viewState}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default MeetingSchedulerLayout;