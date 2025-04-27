/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import RichTextDisplay from "@/app/components/rich-text/RichTextDisplay";
import { Download, Layout, Maximize, Minimize, Calendar } from "lucide-react";
import { Schedule } from "@/types/schedule";

type ViewState = "default" | "full-preview" | "collapsed-preview";

interface SchedulePreviewProps {
  onViewStateChange: (state: ViewState) => void;
  currentViewState: ViewState;
  selectedDate?: string;
  schedules?: Schedule[]; // Using the Schedule type
}

export default function SchedulePreview({
  onViewStateChange,
  currentViewState,
  selectedDate,
  schedules = [],
}: SchedulePreviewProps) {
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        weekday: "short",
      });
    } catch (e) {
      console.error("Date format error:", dateString, e);
      return dateString;
    }
  };

  // Format time for display
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

  return (
    <div className="h-full p-6">
      <div className="flex justify-between items-center mb-6 pb-3 border-b-[1px] border-gray-100">
        <h3 className="text-subtitle font-semibold text-primary flex items-center gap-sm">
          <Calendar className="h-5 w-5" /> PDF Preview
        </h3>
        <div className="flex gap-1 bg-white rounded-md p-1 shadow-sm">
          <Button
            onClick={() => onViewStateChange("collapsed-preview")}
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center p-2 h-8 rounded-md shadow-sm hover:shadow-md border-gray-200",
              currentViewState === "collapsed-preview" &&
                "bg-primary-light text-primary border-primary/30"
            )}
            title="Hide preview panel"
          >
            <Minimize className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onViewStateChange("default")}
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center p-2 h-8 rounded-md shadow-sm hover:shadow-md border-gray-200",
              currentViewState === "default" &&
                "bg-primary-light text-primary border-primary/30"
            )}
            title="Split view (default)"
          >
            <Layout className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onViewStateChange("full-preview")}
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center p-2 h-8 rounded-md shadow-sm hover:shadow-md border-gray-200",
              currentViewState === "full-preview" &&
                "bg-primary-light text-primary border-primary/30"
            )}
            title="Full screen preview"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!selectedDate ? (
        <div className="bg-white p-8 rounded-md shadow-md text-center">
          <div className="py-6">
            <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No date selected</h3>
            <p className="text-text-secondary">
              Select a date in the filter to see the preview
            </p>
          </div>
        </div>
      ) : schedules.length === 0 ? (
        <div className="bg-white p-8 rounded-md shadow-md text-center">
          <div className="py-6">
            <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No schedules found</h3>
            <p className="text-text-secondary">
              No meetings scheduled for {formatDate(selectedDate)}
            </p>
          </div>
        </div>
      ) : (
        <div className="preview-content">
          <div className="bg-white rounded-md overflow-hidden shadow-md">
            <div className="bg-gradient-to-r from-primary-light to-white p-4 flex justify-between items-center border-b border-gray-100">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span className="text-lg font-semibold text-primary">
                  Meeting Schedule
                </span>
              </div>
              <span className="bg-white px-3 py-1 rounded-md shadow-sm text-primary-dark font-medium">
                {formatDate(selectedDate)}
              </span>
            </div>

            <div className="p-5">
              <table className="w-full border-collapse table-fixed">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-red-500 uppercase tracking-wider w-[25%]">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-red-500 uppercase tracking-wider w-[20%]">
                      Venue
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-red-500 uppercase tracking-wider w-[40%]">
                      Agenda
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-red-500 uppercase tracking-wider w-[15%]">
                      Comment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule, index) => (
                    <tr
                      key={schedule.id}
                      className="border-t border-gray-100"
                    >
                      <td className="px-4 py-3 align-top">
                        <div className="text-gray-900">
                          <div>{formatTime(schedule.time_range?.start)}</div>
                          <div className="text-gray-500">to</div>
                          <div>{formatTime(schedule.time_range?.end)}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="prose prose-sm max-w-none break-words">
                          <RichTextDisplay content={schedule.place} />
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="prose prose-sm max-w-none break-words">
                          <RichTextDisplay content={schedule.activity} />
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top text-center">
                        {schedule.comment_link ? (
                          <a
                            href={schedule.comment_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:bg-primary-light/50 px-3 py-1 rounded-md shadow-sm inline-block border border-primary/10 transition-colors"
                          >
                            Link
                          </a>
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 flex justify-end px-5 pb-5">
            <Button
              variant="default"
              size="sm"
              className="bg-red-500 text-white hover:bg-red-600 flex items-center gap-2 shadow-md hover:shadow-lg transition-all px-4 py-2 rounded-md"
              onClick={() => {
                // This would use your PDF generation function
                console.log("Generate PDF for", selectedDate);
                alert(
                  "PDF download functionality will be implemented separately"
                );
              }}
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
