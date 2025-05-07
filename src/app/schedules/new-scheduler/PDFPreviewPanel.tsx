/* eslint-disable */
"use client";

import React from "react";
import { ArrowLeft, ArrowRight, Maximize } from "lucide-react";

interface PDFPreviewProps {
  selectedDate?: string;
  meetings?: any[];
  viewState: "default" | "full-preview" | "collapsed-preview";
  setViewState: (state: "default" | "full-preview" | "collapsed-preview") => void;
}

const PDFPreviewPanel: React.FC<PDFPreviewProps> = ({
  selectedDate,
  meetings = [],
  viewState,
  setViewState
}) => {
  return (
    <div className="h-full p-6 bg-surface">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-subtitle font-medium text-text-primary">
          PDF Preview
        </h2>

        {/* View controls */}
        <div className="flex gap-1">
          <button
            onClick={() => setViewState("collapsed-preview")}
            className={`h-8 w-8 flex items-center justify-center border border-divider rounded-md hover:bg-hover ${viewState === "collapsed-preview" ? "bg-indigo-100 text-indigo-700" : "bg-background"}`}
            title="Collapse preview"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewState("full-preview")}
            className={`h-8 w-8 flex items-center justify-center border border-divider rounded-md hover:bg-hover ${viewState === "full-preview" ? "bg-indigo-100 text-indigo-700" : "bg-background"}`}
            title="Full screen"
          >
            <Maximize className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewState("default")}
            className={`h-8 w-8 flex items-center justify-center border border-divider rounded-md hover:bg-hover ${viewState === "default" ? "bg-indigo-100 text-indigo-700" : "bg-background"}`}
            title="Default view"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!selectedDate ? (
        <div className="text-center text-text-secondary py-12 bg-background rounded-md border border-divider shadow-sm">
          Select a date in the filter to see the preview.
        </div>
      ) : (
        <div className="bg-white rounded-md border border-divider shadow-sm">
          {/* PDF Header */}
          <div className="border-b border-divider p-4 flex justify-between items-center">
            <h3 className="font-medium text-text-primary text-lg">
              Meeting Schedule
            </h3>
            <span className="text-text-secondary">{selectedDate}</span>
          </div>

          {/* PDF Table */}
          <div className="overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-divider bg-surface">
                  <th className="text-left p-3 text-sm font-medium text-text-primary w-1/6">
                    Time
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-text-primary w-1/3">
                    Venue
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-text-primary w-1/3">
                    Agenda
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-text-primary w-1/6">
                    Comment
                  </th>
                </tr>
              </thead>
              <tbody>
                {meetings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-4 text-center text-text-secondary"
                    >
                      No meetings scheduled for this date.
                    </td>
                  </tr>
                ) : (
                  meetings.map((meeting) => (
                    <tr key={meeting.id} className="border-b border-divider">
                      <td className="p-3 align-top">{meeting.time}</td>
                      <td className="p-3 align-top">{meeting.venue}</td>
                      <td className="p-3 align-top">{meeting.agenda}</td>
                      <td className="p-3 align-top text-center">
                        {meeting.commentLink && (
                          <a
                            href={meeting.commentLink}
                            className="text-primary hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Link
                          </a>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFPreviewPanel;
