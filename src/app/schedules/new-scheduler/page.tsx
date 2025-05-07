"use client";

import React, { useEffect } from 'react';
import MeetingSchedulerLayout from './MeetingSchedulerLayout';
import { ToastProvider } from './contexts/ToastContext';
import { useScheduleUIStore } from '@/stores/scheduleUIStore';

export default function NewSchedulerPage() {
  // Get reset function from UI store
  const resetUI = useScheduleUIStore(state => state.resetUI);
  
  // Reset UI state when the page loads
  useEffect(() => {
    resetUI();
  }, [resetUI]);
  
  return (
    <div className="container mx-auto px-4 py-6 bg-background">
      <h1 className="text-heading font-bold mb-6 text-text-primary">New Meeting Scheduler</h1>
      <p className="mb-6 text-text-secondary">
        This page demonstrates a clean, modular implementation of the meeting scheduler interface.
      </p>
      
      <div className="w-full">
        <ToastProvider>
          <MeetingSchedulerLayout />
        </ToastProvider>
      </div>
    </div>
  );
}
