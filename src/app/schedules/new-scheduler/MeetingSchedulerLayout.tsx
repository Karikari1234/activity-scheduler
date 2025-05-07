/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import MeetingManagerPanel from './MeetingManagerPanel';
import PDFPreviewPanel from './PDFPreviewPanel';

// Sample meeting data
const sampleMeetings = [
  {
    id: '1',
    date: 'May 7, 2025',
    time: '10:57 AM',
    venue: 'New meeting',
    agenda: 'We dont know',
    commentLink: 'https://example.com/comment'
  }
];

// Main layout component
const MeetingSchedulerLayout = () => {
  const [viewState, setViewState] = useState<"default" | "full-preview" | "collapsed-preview">("default");
  const [selectedDate, setSelectedDate] = useState<string>("May 7, 2025");
  const [meetings, setMeetings] = useState(sampleMeetings);

  return (
    <div className="flex w-full min-h-[calc(100vh-10rem)] border border-divider rounded-md overflow-hidden shadow-sm">
      {/* Left panel - Meeting Manager (2/3 width) */}
      <div className={`transition-all duration-300 ease-in-out ${
        viewState === "full-preview" 
          ? "w-0 opacity-0 overflow-hidden" 
          : viewState === "collapsed-preview" 
            ? "w-full" 
            : "w-2/3"
      }`}>
        <MeetingManagerPanel />
      </div>
      
      {/* Right panel - PDF Preview (1/3 width) */}
      <div className={`transition-all duration-300 ease-in-out ${
        viewState === "full-preview" 
          ? "w-full" 
          : viewState === "collapsed-preview" 
            ? "w-0 opacity-0 overflow-hidden" 
            : "w-1/3"
      } bg-surface border-l border-divider`}>
        <PDFPreviewPanel
          selectedDate={selectedDate}
          meetings={meetings}
        />
      </div>
    </div>
  );
};

export default MeetingSchedulerLayout;
