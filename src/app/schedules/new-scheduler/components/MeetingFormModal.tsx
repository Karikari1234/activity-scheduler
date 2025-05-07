/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface MeetingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meeting: any) => void;
  meeting?: any;
}

const MeetingFormModal: React.FC<MeetingFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  meeting
}) => {
  const [formData, setFormData] = useState({
    date: meeting?.date || '',
    time: meeting?.time || '',
    venue: meeting?.venue || '',
    agenda: meeting?.agenda || '',
    commentLink: meeting?.commentLink || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-md shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-divider">
          <h2 className="text-subtitle font-medium text-text-primary">Add New Meeting</h2>
          <button 
            onClick={onClose} 
            className="text-text-secondary hover:text-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-text-primary mb-1">
              Date *
            </label>
            <input
              type="text"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input-text w-full"
              placeholder="MM/DD/YYYY"
              required
            />
          </div>

          {/* Time */}
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-text-primary mb-1">
              Time *
            </label>
            <input
              type="text"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="input-text w-full"
              placeholder="HH:MM AM/PM"
              required
            />
          </div>

          {/* Venue */}
          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-text-primary mb-1">
              Venue * (বাংলা লিখতে পারেন)
            </label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              className="input-text w-full"
              placeholder="e.g., Conference Room A"
              required
            />
          </div>

          {/* Agenda */}
          <div>
            <label htmlFor="agenda" className="block text-sm font-medium text-text-primary mb-1">
              Agenda * (বাংলা লিখতে পারেন)
            </label>
            <textarea
              id="agenda"
              name="agenda"
              value={formData.agenda}
              onChange={handleChange}
              className="input-text w-full min-h-[100px]"
              placeholder="Meeting topics, discussions, etc."
              required
            />
          </div>

          {/* Comment Link */}
          <div>
            <label htmlFor="commentLink" className="block text-sm font-medium text-text-primary mb-1">
              Comment Link (Optional)
            </label>
            <input
              type="url"
              id="commentLink"
              name="commentLink"
              value={formData.commentLink}
              onChange={handleChange}
              className="input-text w-full"
              placeholder="https://example.com/docs"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-text-primary px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              SAVE MEETING
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingFormModal;
