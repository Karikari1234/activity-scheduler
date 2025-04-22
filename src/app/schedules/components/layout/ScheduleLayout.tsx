/* eslint-disable */
"use client";

import { useState } from "react";
import ScheduleManager from "./ScheduleManager";
import SchedulePreview from "./SchedulePreview";

type ViewState = "default" | "full-preview" | "collapsed-preview";
// @typescript-eslint/no-unused-vars
export default function ScheduleLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [viewState, setViewState] = useState<ViewState>("default");

  const handleViewStateChange = (newState: ViewState) => {
    setViewState(newState);
  };

  return (
    <div className="flex w-full min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out">
      <div
        className={`transition-all duration-300 ease-in-out overflow-y-auto ${
          viewState === "full-preview"
            ? "w-0 opacity-0 overflow-hidden"
            : viewState === "collapsed-preview"
            ? "w-full"
            : "w-2/3"
        }`}
      >
        <ScheduleManager />
      </div>
      <div
        className={`transition-all duration-300 ease-in-out bg-surface border-l border-divider overflow-y-auto ${
          viewState === "full-preview"
            ? "w-full"
            : viewState === "collapsed-preview"
            ? "w-0 opacity-0 overflow-hidden"
            : "w-1/3"
        }`}
      >
        <SchedulePreview
          onViewStateChange={handleViewStateChange}
          currentViewState={viewState}
        />
      </div>
    </div>
  );
}
