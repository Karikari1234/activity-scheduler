/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import MeetingCard from './components/MeetingCard';
import MeetingFormModal from './components/MeetingFormModal';

const MeetingManagerPanel = () => {
  const [filterDate, setFilterDate] = useState<string>('05/07/2025');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<any>(null);
  const [meetings, setMeetings] = useState<any[]>([
    {
      id: '1',
      date: 'May 7, 2025',
      time: '10:57 AM',
      venue: 'New meeting',
      agenda: 'We dont know',
      commentLink: 'https://example.com/comment'
    }
  ]);

  const handleClearFilter = () => {
    setFilterDate('');
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
    if (editingMeeting) {
      // Update existing meeting
      setMeetings(meetings.map(m => 
        m.id === editingMeeting.id ? { ...meetingData, id: editingMeeting.id } : m
      ));
    } else {
      // Add new meeting
      setMeetings([...meetings, { ...meetingData, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteMeeting = (id: string) => {
    setMeetings(meetings.filter(m => m.id !== id));
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
              <input 
                type="text" 
                className="input-text pr-8"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                placeholder="MM/DD/YYYY"
              />
              <Calendar className="absolute right-2 text-text-secondary w-4 h-4" />
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
        {meetings.length === 0 ? (
          <div className="text-center text-text-secondary py-12 border border-divider rounded-md bg-surface">
            No meetings scheduled yet.
          </div>
        ) : (
          meetings.map(meeting => (
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
