/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";
import MeetingManagerPanel from "./MeetingManagerPanel";
import PDFPreviewPanel from "./PDFPreviewPanel";
import { format, parse, isValid } from "date-fns";

// Sample meeting data
const sampleMeetings = [
  {
    id: "1",
    date: "May 7, 2025",
    time: "10:57 AM",
    venue: "New meeting",
    agenda: "We dont know",
    commentLink: "https://example.com/comment",
  },
  {
    id: "2",
    date: "May 8, 2025",
    time: "2:30 PM",
    venue: "Conference Room A",
    agenda: "Project planning session",
    commentLink: "https://example.com/project-notes",
  },
  {
    id: "3",
    date: "May 7, 2025",
    time: "4:00 PM",
    venue: "Virtual meeting",
    agenda: "Weekly status update",
    commentLink: "",
  },
];

// Main layout component
const MeetingSchedulerLayout = () => {
  const [viewState, setViewState] = useState<
    "default" | "full-preview" | "collapsed-preview"
  >("default");
  const [filterDate, setFilterDate] = useState<string>("05/07/2025");
  const [meetings, setMeetings] = useState(sampleMeetings);
  const [filteredMeetings, setFilteredMeetings] = useState(sampleMeetings);
  const [formattedSelectedDate, setFormattedSelectedDate] =
    useState<string>("May 7, 2025");

  // Filter meetings when filterDate changes
  useEffect(() => {
    if (!filterDate) {
      // If no filter date, show all meetings
      setFilteredMeetings(meetings);
      setFormattedSelectedDate("");
      return;
    }

    try {
      // Parse the filter date (MM/DD/YYYY) to a Date object
      const dateObj = parse(filterDate, "MM/dd/yyyy", new Date());

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
    }
  }, [filterDate, meetings]);

  // Handler for adding/updating meetings
  const handleUpdateMeetings = (
    updatedMeetings: React.SetStateAction<
      {
        id: string;
        date: string;
        time: string;
        venue: string;
        agenda: string;
        commentLink: string;
      }[]
    >
  ) => {
    setMeetings(updatedMeetings);
  };

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
        <MeetingManagerPanel
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          meetings={filteredMeetings}
          updateMeetings={handleUpdateMeetings}
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
        />
      </div>
    </div>
  );
};

export default MeetingSchedulerLayout;
