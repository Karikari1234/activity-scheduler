/* eslint-disable */
"use client";

import React, { useState } from "react";
import { ArrowRight, Maximize, RefreshCw, Download } from "lucide-react";
import { useScheduleUIStore } from "@/stores/scheduleUIStore";
import { MeetingUI } from "./utils/dataConverters";
import { generateMeetingsPDF } from "./utils/pdf/pdfGenerator";
import { useToast } from "./contexts/ToastContext";

interface PDFPreviewProps {
  selectedDate?: string;
  meetings?: MeetingUI[];
  viewState: "default" | "full-preview" | "collapsed-preview";
  setViewState: (state: "default" | "full-preview" | "collapsed-preview") => void;
  loading?: boolean;
}

const PDFPreviewPanel: React.FC<PDFPreviewProps> = ({
  selectedDate,
  meetings = [],
  viewState,
  setViewState,
  loading = false
}) => {
  const { showToast } = useToast();
  const [generatingPDF, setGeneratingPDF] = useState(false);
  
  // Generate and download PDF
  const handleDownloadPDF = async () => {
    if (!selectedDate || meetings.length === 0) return;
    
    try {
      setGeneratingPDF(true);
      
      // Generate PDF using our utility function
      await generateMeetingsPDF(meetings, selectedDate);
      
      // Show success message
      showToast("PDF generated successfully", "success");
    } catch (error: Error | unknown) {
      console.error("PDF generation failed:", error);
      showToast(
        error instanceof Error ? error.message : "Failed to generate PDF", 
        "error"
      );
    } finally {
      setGeneratingPDF(false);
    }
  };

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
            onClick={() => setViewState("full-preview")}
            className={`h-8 w-8 flex items-center justify-center border border-divider rounded-md hover:bg-hover ${viewState === "full-preview" ? "bg-indigo-100 text-indigo-700" : "bg-background"}`}
            title="Full screen preview"
          >
            <Maximize className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewState("default")}
            className={`h-8 w-8 flex items-center justify-center border border-divider rounded-md hover:bg-hover ${viewState === "default" ? "bg-indigo-100 text-indigo-700" : "bg-background"}`}
            title="Split view"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownloadPDF}
            className={`h-8 w-8 flex items-center justify-center border border-divider rounded-md hover:bg-hover bg-background ${generatingPDF ? 'opacity-50' : ''}`}
            title="Download PDF"
            disabled={!selectedDate || meetings.length === 0 || generatingPDF}
          >
            {generatingPDF ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-text-secondary py-12 bg-background rounded-md border border-divider shadow-sm flex flex-col items-center justify-center">
          <RefreshCw className="w-8 h-8 animate-spin mb-4 text-primary" />
          <p>Loading meetings data...</p>
        </div>
      ) : !selectedDate ? (
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
          
          {/* PDF Footer */}
          <div className="border-t border-divider p-4 text-center">
            <p className="text-text-secondary text-sm">
              {meetings.length} meeting{meetings.length !== 1 ? 's' : ''} scheduled for {selectedDate}
            </p>
            {meetings.length > 0 && (
              <button 
                onClick={handleDownloadPDF}
                disabled={generatingPDF}
                className={`mt-2 btn-secondary text-sm px-4 py-1 inline-flex items-center gap-2 ${generatingPDF ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {generatingPDF ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-3 h-3" />
                    Download as PDF
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFPreviewPanel;