"use client";

import ScheduleLayout from "../components/layout/ScheduleLayout";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useScheduleUIStore } from "@/stores/scheduleUIStore";
import { useEffect } from "react";

// This is a demo page to showcase the improved layout component
export default function LayoutDemoPage() {
  // Reset UI state when the page loads
  const resetUI = useScheduleUIStore(state => state.resetUI);
  
  useEffect(() => {
    // Reset UI state when component mounts
    resetUI();
  }, [resetUI]);
  
  return (
    <div className="bg-background min-h-screen w-full">
      <div className="w-full px-sm py-sm sm:px-md sm:py-md">
        <div className="max-w-7xl mx-auto mb-md">
          <h1 className="text-heading font-bold mb-xs text-primary">Meeting Scheduler</h1>
          <p className="mb-sm text-text-secondary">
            This page demonstrates the improved Schedule Layout with new controls for a better user experience.
            Try using the different view controls in the preview pane.
          </p>
          
          <div className="flex mb-sm">
            <Link href="/schedules" className="text-primary hover:underline flex items-center gap-xs transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Schedules
            </Link>
          </div>
        </div>
        
        <div className="rounded-md overflow-hidden shadow-md w-full">
          <ScheduleLayout />
        </div>
      </div>
    </div>
  );
}
