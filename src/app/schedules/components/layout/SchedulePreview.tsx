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
    <div className="h-full p-md">
      <div className="flex justify-between items-center mb-lg pb-sm border-b border-divider">
        <h3 className="text-subtitle font-medium text-primary flex items-center gap-sm">
          <Calendar className="h-5 w-5" /> Schedule Preview
        </h3>
        <div className="flex gap-xs">
          <Button
            onClick={() => onViewStateChange("collapsed-preview")}
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center gap-xs text-xs font-medium",
              currentViewState === "collapsed-preview" &&
                "bg-primary-light border-primary text-primary"
            )}
            title="Hide preview panel and show only the schedule manager"
          >
            <Minimize className="h-4 w-4" />
            <span>Hide Preview</span>
          </Button>
          <Button
            onClick={() => onViewStateChange("default")}
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center gap-xs text-xs font-medium",
              currentViewState === "default" &&
                "bg-primary-light border-primary text-primary"
            )}
            title="Show both panels (default view)"
          >
            <Layout className="h-4 w-4" />
            <span>Split View</span>
          </Button>
          <Button
            onClick={() => onViewStateChange("full-preview")}
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center gap-xs text-xs font-medium",
              currentViewState === "full-preview" &&
                "bg-primary-light border-primary text-primary"
            )}
            title="Expand preview to full screen"
          >
            <Maximize className="h-4 w-4" />
            <span>Full Preview</span>
          </Button>
        </div>
      </div>

      {!selectedDate ? (
        <div className="bg-surface p-lg rounded-md shadow-sm text-center">
          <p className="text-text-secondary italic">
            Select a date in the filter to see the preview.
          </p>
        </div>
      ) : schedules.length === 0 ? (
        <div className="bg-surface p-lg rounded-md shadow-sm text-center">
          <p className="text-text-secondary italic">
            No schedules found for {formatDate(selectedDate)}.
          </p>
        </div>
      ) : (
        <div className="preview-content">
          <div className="bg-surface rounded-md overflow-hidden shadow-sm border border-divider">
            <div className="bg-primary-light p-md flex justify-between items-center">
              <span className="text-lg font-medium text-primary">
                Meeting Schedule
              </span>
              <span className="text-primary-dark font-medium">
                {formatDate(selectedDate)}
              </span>
            </div>

            <div className="p-md">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-sm border-b-2 border-divider text-left text-sm font-medium text-text-secondary uppercase tracking-wide">
                      Time
                    </th>
                    <th className="p-sm border-b-2 border-divider text-left text-sm font-medium text-text-secondary uppercase tracking-wide">
                      Place
                    </th>
                    <th className="p-sm border-b-2 border-divider text-left text-sm font-medium text-text-secondary uppercase tracking-wide">
                      Activity
                    </th>
                    <th className="p-sm border-b-2 border-divider text-left text-sm font-medium text-text-secondary uppercase tracking-wide">
                      Comment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule, index) => (
                    <tr
                      key={schedule.id}
                      className={index % 2 === 0 ? "bg-background" : ""}
                    >
                      <td className="p-sm border-b border-divider align-top">
                        {`${formatTime(
                          schedule.time_range?.start
                        )} - ${formatTime(schedule.time_range?.end)}`}
                      </td>
                      <td className="p-sm border-b border-divider align-top">
                        <div className="prose prose-sm max-w-none">
                          <RichTextDisplay content={schedule.place} />
                        </div>
                      </td>
                      <td className="p-sm border-b border-divider align-top">
                        <div className="prose prose-sm max-w-none">
                          <RichTextDisplay content={schedule.activity} />
                        </div>
                      </td>
                      <td className="p-sm border-b border-divider align-top">
                        {schedule.comment_link ? (
                          <a
                            href={schedule.comment_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
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

          <div className="mt-md flex justify-end">
            <Button
              variant="default"
              size="sm"
              className="bg-primary text-white hover:bg-primary-dark flex items-center gap-xs"
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
