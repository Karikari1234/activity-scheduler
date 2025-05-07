/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { DayPicker } from 'react-day-picker';
import MeetingCard from './components/MeetingCard';
import MeetingFormModal from './components/MeetingFormModal';

interface MeetingManagerPanelProps {
  filterDate: string;
  setFilterDate: (date: string) => void;
  meetings: any[];
  updateMeetings: (meetings: any[]) => void;
}

const MeetingManagerPanel: React.FC<MeetingManagerPanelProps> = ({ 
  filterDate, 
  setFilterDate, 
  meetings: initialMeetings, 
  updateMeetings 
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<any>(null);

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

  const handleOpenEditModal = (meeting: any) => {
    setEditingMeeting(meeting);
    setIsModalOpen(true);
  };

  const handleSaveMeeting = (meetingData: any) => {
    let updatedMeetings;
    
    if (editingMeeting) {
      // Update existing meeting
      updatedMeetings = initialMeetings.map(m => 
        m.id === editingMeeting.id ? { ...meetingData, id: editingMeeting.id } : m
      );
    } else {
      // Add new meeting
      updatedMeetings = [...initialMeetings, { ...meetingData, id: Date.now().toString() }];
    }
    
    // Update meetings in parent component
    updateMeetings(updatedMeetings);
    setIsModalOpen(false);
  };

  const handleDeleteMeeting = (id: string) => {
    const updatedMeetings = initialMeetings.filter(m => m.id !== id);
    updateMeetings(updatedMeetings);
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
                    className="input-text pr-8 flex items-center cursor-pointer text-left"
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
          </div>
          
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors uppercase text-sm">
            DOWNLOAD PDF
          </button>
        </div>
      </div>
      
      {/* Meeting List */}
      <div className="space-y-4">
        {initialMeetings.length === 0 ? (
          <div className="text-center text-text-secondary py-12 border border-divider rounded-md bg-surface">
            {filterDate ? 'No meetings scheduled for this date.' : 'No meetings scheduled yet.'}
          </div>
        ) : (
          initialMeetings.map(meeting => (
            <MeetingCard 
              key={meeting.id}
              meeting={meeting}
              onEdit={() => handleOpenEditModal(meeting)}
              onDelete={() => handleDeleteMeeting(meeting.id)}
            />
          ))
        )}
      </div>

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
