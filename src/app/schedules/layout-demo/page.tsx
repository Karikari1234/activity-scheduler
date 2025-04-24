"use client";

import ScheduleLayout from "../components/layout/ScheduleLayout";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// This is a demo page to showcase the improved layout component
export default function LayoutDemoPage() {
  return (
    <div className="container mx-auto py-md px-md">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-xs text-primary">Layout Demo with Improved Preview</h1>
        <p className="mb-md text-text-secondary">
          This page demonstrates the updated Schedule Layout with text-based control buttons for better usability.
          Try using the different view controls in the preview pane.
        </p>
        
        <div className="flex mb-md">
          <Link href="/schedules" className="text-primary hover:underline flex items-center gap-xs">
            <ArrowLeft className="h-4 w-4" /> Back to Schedules
          </Link>
        </div>
        
        <div className="border border-divider rounded-md overflow-hidden bg-background shadow-sm">
          <ScheduleLayout />
        </div>
      </div>
    </div>
  );
}
