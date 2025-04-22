/* eslint-disable */
"use client";
import { ScheduleLayout } from "../components/layout";
import ScheduleManagerWithModal from "../components/layout/ScheduleManagerWithModal";
import SchedulePreview from "../components/layout/SchedulePreview";

export default function IntegratedDemoPage() {
  return (
    <div className="container mx-auto">
      <div className="flex w-full min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out">
        <div className="w-2/3 transition-all duration-300 ease-in-out overflow-y-auto">
          <ScheduleManagerWithModal />
        </div>
        <div className="w-1/3 transition-all duration-300 ease-in-out bg-surface border-l border-divider overflow-y-auto">
          <SchedulePreview
            onViewStateChange={() => {}}
            currentViewState="default"
          />
        </div>
      </div>
    </div>
  );
}
