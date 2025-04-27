/* eslint-disable */
"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import RichTextDisplay from "@/app/components/rich-text/RichTextDisplay";
import { Calendar } from "lucide-react";
import { useScheduleStore } from "@/stores/scheduleStore";
import { useScheduleUIStore } from "@/stores/scheduleUIStore";

interface ScheduleManagerProps {
  onDateChange?: (date: string | undefined) => void;
}

export default function ScheduleManager({
  onDateChange,
}: ScheduleManagerProps) {
  // Get state and actions from Zustand stores
  const { 
    schedules, 
    loading, 
    error, 
    filterDate, 
    setFilterDate 
  } = useScheduleStore();
  
  const { 
    openAddModal, 
    openEditModal 
  } = useScheduleUIStore();

  // Add a ref to track if this is the initial mount
  const isInitialMount = useRef(true);

  // Function to format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      console.error("Date format error:", dateString, e);
      return dateString;
    }
  };

  // Function to format time in a nicer way
  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    try {
      const [hours, minutes] = timeString.split(":");
      const h = parseInt(hours, 10);
      const m = parseInt(minutes, 10);
      if (isNaN(h) || isNaN(m)) return timeString;
      const ampm = h >= 12 ? "PM" : "AM";
      const formattedHours = h % 12 === 0 ? 12 : h % 12;
      const formattedMinutes = m < 10 ? "0" + m : m;
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    } catch (e) {
      console.error("Time format error:", timeString, e);
      return timeString;
    }
  };

  // Handle filter date change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setFilterDate(newDate || null);

    // Notify parent component about the date change if needed
    if (onDateChange) {
      onDateChange(newDate || undefined);
    }
  };

  // Clear the filter
  const clearFilter = () => {
    setFilterDate(null);

    // Notify parent component about the date change if needed
    if (onDateChange) {
      onDateChange(undefined);
    }
  };

  return (
    <div className="h-full p-md">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-heading font-bold text-text-primary mb-lg">
          Schedule Manager
        </h1>

        <div className="flex justify-between items-center mb-lg flex-wrap gap-md mb-4">
          <Button 
            className="bg-primary text-white hover:bg-primary-dark"
            onClick={openAddModal}
          >
            Add New Schedule
          </Button>

          <div className="flex items-center gap-sm">
            <div className="flex items-center gap-sm">
              <label
                htmlFor="filterDate"
                className="text-text-secondary font-medium"
              >
                Filter by Date:
              </label>
              <div className="relative">
                <Input
                  type="date"
                  id="filterDate"
                  className="w-auto pr-9"
                  value={filterDate || ''}
                  onChange={handleFilterChange}
                />
                <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5 pointer-events-none" />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-full"
                title="Clear Filter"
                onClick={clearFilter}
                disabled={!filterDate}
              >
                ×
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-md">
          {loading ? (
            <div className="bg-surface p-lg rounded-md shadow-sm text-center">
              <p className="text-text-secondary">Loading schedules...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-lg rounded-md shadow-sm text-center">
              <p className="text-red-600">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Reload
              </Button>
            </div>
          ) : schedules.length === 0 ? (
            <div className="bg-surface p-lg rounded-md shadow-sm text-center">
              <p className="text-text-secondary">
                {filterDate
                  ? `No schedules found for ${formatDate(filterDate)}.`
                  : "No schedules found. Add one to get started!"}
              </p>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); openAddModal(); }} 
                className="text-primary hover:underline mt-md inline-block"
              >
                Create your first schedule
              </a>
            </div>
          ) : (
            schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 mb-4"
              >
                <div className="flex flex-col">
                  <div className="bg-red-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-lg font-semibold text-red-700">
                          {formatDate(schedule.schedule_date)}
                        </h2>
                        <p className="text-gray-600 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {formatTime(schedule.time_range.start)} -{" "}
                          {formatTime(schedule.time_range.end)}
                        </p>
                      </div>
                      <div className="hidden md:block">
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          Scheduled
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Place
                        </h3>
                        <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-3 rounded-md">
                          <RichTextDisplay content={schedule.place} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                              clipRule="evenodd"
                            />
                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                          </svg>
                          Activity
                        </h3>
                        <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-3 rounded-md">
                          <RichTextDisplay content={schedule.activity} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 border-red-300 hover:border-red-500 transition-colors flex items-center gap-1"
                        onClick={() => openEditModal(schedule)}
                      >
                        View Details
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
