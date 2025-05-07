"use client";

import React from 'react';
import MeetingSchedulerLayout from './MeetingSchedulerLayout';

export default function NewSchedulerPage() {
  return (
    <div className="container mx-auto px-4 py-6 bg-background">
      <h1 className="text-heading font-bold mb-6 text-text-primary">New Meeting Scheduler</h1>
      <p className="mb-6 text-text-secondary">
        This page demonstrates a clean, modular implementation of the meeting scheduler interface.
      </p>
      
      <div className="w-full">
        <MeetingSchedulerLayout />
      </div>
    </div>
  );
}
