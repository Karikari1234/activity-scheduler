"use client";

import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface Meeting {
  id: string;
  date: string;
  time: string;
  venue: string;
  agenda: string;
  commentLink?: string;
}

interface MeetingCardProps {
  meeting: Meeting;
  onEdit: () => void;
  onDelete: () => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, onEdit, onDelete }) => {
  return (
    <div className="bg-background border border-divider rounded-md shadow-sm overflow-hidden">
      <div className="flex justify-between items-start p-4">
        <div className="flex-1">
          {/* Meeting date/time with blue left border */}
          <div className="border-l-4 border-blue-600 pl-3 mb-4">
            <h3 className="text-blue-700 font-medium">
              {meeting.date} | {meeting.time}
            </h3>
          </div>
          
          {/* Meeting details */}
          <div className="space-y-3 pl-3">
            <div>
              <span className="font-medium">Venue: </span>
              <span className="text-text-secondary">{meeting.venue}</span>
            </div>
            
            <div>
              <span className="font-medium">Agenda: </span>
              <div className="text-text-secondary border border-divider bg-surface p-3 rounded-md mt-1">
                {meeting.agenda}
              </div>
            </div>
            
            {meeting.commentLink && (
              <div>
                <span className="font-medium">Comment: </span>
                <a href={meeting.commentLink} className="text-primary hover:underline">
                  Link
                </a>
              </div>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <button 
            onClick={onEdit}
            className="text-yellow-500 hover:text-yellow-600"
            title="Edit meeting"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button 
            onClick={onDelete}
            className="text-red-500 hover:text-red-600"
            title="Delete meeting"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingCard;
