/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import { Calendar, X, RefreshCw, Download } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { DayPicker } from 'react-day-picker';
import MeetingCard from './components/MeetingCard';
import MeetingFormModal from './components/MeetingFormModal';
import { useScheduleUIStore } from '@/stores/scheduleUIStore';
import { MeetingUI } from './utils/dataConverters';
import { useToast } from './contexts/ToastContext';

interface MeetingManagerPanelProps {
  filterDate: string;
  setFilterDate: (date: string) => void;
  meetings: MeetingUI[];
  updateMeetings: {
    add: (meeting: Partial<MeetingUI>) => Promise<boolean>;
    update: (id: string, meeting: Partial<MeetingUI>) => Promise<boolean>;
    delete: (id: string) => Promise<boolean>;
  };
  loading?: boolean;
  onRefresh?: () => void;
}

const MeetingManagerPanel: React.FC<MeetingManagerPanelProps> = ({ 
  filterDate, 
  setFilterDate, 
  meetings, 
  updateMeetings,
  loading = false,
  onRefresh
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<MeetingUI | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  
  // Get UI store functions for more efficient modal management
  const openAddModal = useScheduleUIStore(state => state.openAddModal);
  
  // Get toast functionality for user feedback
  const { showToast } = useToast();

  const handleClearFilter = () => {
    setFilterDate('');
    setCalendarOpen(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFilterDate(format(date, 'MM/dd/yyyy'));
    }
    setCalendarOpen(false);
  };

  const handleOpenAddModal = () => {
    setEditingMeeting(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (meeting: MeetingUI) => {
    setEditingMeeting(meeting);
    setIsModalOpen(true);
  };

  const handleSaveMeeting = async (meetingData: Partial<MeetingUI>) => {
    if (editingMeeting) {
      // Update existing meeting
      const success = await updateMeetings.update(editingMeeting.id, meetingData);
      if (success) {
        setIsModalOpen(false);
        onRefresh?.(); // Refresh after successful update
      }
      return success; // Ensure a boolean is returned
    } else {
      // Add new meeting
      const success = await updateMeetings.add(meetingData);
      if (success) {
        setIsModalOpen(false);
        onRefresh?.(); // Refresh after successful add
      }
      return success; // Ensure a boolean is returned
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    const success = await updateMeetings.delete(id);
    if (success) {
      onRefresh?.(); // Refresh after successful delete
    }
  };

  return (
    <div className="h-full p-6 bg-background">
      {/* Header */}
      <h1 className="text-heading font-medium text-blue-700 mb-6">Meeting Scheduler</h1>
      
      {/* Action Bar */}
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <button 
          className="btn-primary uppercase text-sm"
          onClick={handleOpenAddModal}
        >
          ADD NEW MEETING
        </button>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-text-secondary whitespace-nowrap">Filter by Date:</span>
            <div className="relative flex items-center">
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <button 
                    type="button"
                    className="input-text pr-8 w-48 flex items-center cursor-pointer text-left"
                    onClick={() => setCalendarOpen(true)}
                  >
                    {filterDate || "Select date..."}
                    <Calendar className="absolute right-2 text-text-secondary w-4 h-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="p-0 bg-white border border-divider rounded-md shadow-md z-50">
                  <DayPicker
                    mode="single"
                    selected={filterDate ? new Date(filterDate) : undefined}
                    onSelect={handleDateSelect}
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <button 
              className="h-9 w-9 flex items-center justify-center border border-divider rounded-md bg-background text-xl"
              onClick={handleClearFilter}
              disabled={!filterDate}
            >
              <X className="w-4 h-4" />
            </button>
            {onRefresh && (
              <button 
                className="h-9 w-9 flex items-center justify-center border border-divider rounded-md bg-background text-xl"
                onClick={onRefresh}
                disabled={loading}
                title="Refresh meetings"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
          
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors uppercase text-sm"
            onClick={() => {
              if (!meetings || meetings.length === 0) {
                return;
              }
              
              setGeneratingPDF(true);
              
              // Import dynamically to avoid issues with SSR
              import('./utils/pdf/pdfGenerator').then(({ generateMeetingsPDF }) => {
                const formattedDate = filterDate ? new Date(filterDate).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                }) : 'Schedule';
                
                showToast("Generating PDF...", "info");
                
                generateMeetingsPDF(meetings, formattedDate)
                  .then(() => {
                    showToast("PDF generated successfully", "success");
                  })
                  .catch((error: Error | unknown) => {
                    console.error('Failed to generate PDF:', error);
                    showToast(
                      error instanceof Error ? error.message : "Failed to generate PDF", 
                      "error"
                    );
                  })
                  .finally(() => {
                    setGeneratingPDF(false);
                  });
              });
            }}
            disabled={!filterDate || loading || meetings.length === 0 || generatingPDF}
            title="Download PDF of the filtered meetings"
          >
            <span className="flex items-center gap-1">
              {generatingPDF ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {generatingPDF ? "GENERATING..." : "DOWNLOAD PDF"}
            </span>
          </button>
        </div>
      </div>
      
      {/* Loading and Empty States */}
      {loading ? (
        <div className="text-center text-text-secondary py-12 border border-divider rounded-md bg-surface flex flex-col items-center justify-center">
          <RefreshCw className="w-8 h-8 animate-spin mb-4 text-primary" />
          <p>Loading meetings...</p>
        </div>
      ) : meetings.length === 0 ? (
        <div className="text-center text-text-secondary py-12 border border-divider rounded-md bg-surface">
          {filterDate ? 'No meetings scheduled for this date.' : 'No meetings scheduled yet.'}
          <div className="mt-4">
            <button 
              className="btn-secondary text-sm py-2 px-4"
              onClick={handleOpenAddModal}
            >
              Create a meeting
            </button>
          </div>
        </div>
      ) : (
        /* Meeting List */
        <div className="space-y-4">
          {meetings.map(meeting => (
            <MeetingCard 
              key={meeting.id}
              meeting={meeting}
              onEdit={() => handleOpenEditModal(meeting)}
              onDelete={() => handleDeleteMeeting(meeting.id)}
            />
          ))}
        </div>
      )}

      {/* Meeting Form Modal */}
      <MeetingFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMeeting}
        meeting={editingMeeting}
      />
    </div>
  );
};

export default MeetingManagerPanel;