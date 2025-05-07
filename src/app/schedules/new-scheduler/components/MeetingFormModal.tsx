/* eslint-disable prefer-const */
"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Clock, X } from "lucide-react";
import { format, parse } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import { MeetingUI } from "../utils/dataConverters";

// Time options for dropdown
const timeOptions: string[] = [];
// Generate time options in 30-minute intervals
for (let hour = 0; hour < 24; hour++) {
  for (let minute of [0, 30]) {
    const period = hour < 12 ? "AM" : "PM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const displayMinute = minute.toString().padStart(2, "0");
    timeOptions.push(`${displayHour}:${displayMinute} ${period}`);
  }
}

interface MeetingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meeting: Partial<MeetingUI>) => Promise<boolean>;
  meeting?: MeetingUI | null;
}

const MeetingFormModal: React.FC<MeetingFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  meeting,
}) => {
  const [formData, setFormData] = useState({
    date: meeting?.date || "",
    time: meeting?.time || "",
    timeEnd: meeting?.timeEnd || "",
    venue: meeting?.venue || "",
    agenda: meeting?.agenda || "",
    commentLink: meeting?.commentLink || "",
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Initialize form data when meeting changes
  useEffect(() => {
    if (meeting) {
      setFormData({
        date: meeting.date || "",
        time: meeting.time || "",
        timeEnd: meeting.timeEnd || "",
        venue: meeting.venue || "",
        agenda: meeting.agenda || "",
        commentLink: meeting.commentLink || "",
      });
      
      // Set selected date for the calendar
      try {
        if (meeting.date) {
          const parsedDate = parse(meeting.date, "MMMM d, yyyy", new Date());
          setSelectedDate(parsedDate);
        }
      } catch (error) {
        console.error("Failed to parse date", error);
      }
    } else {
      // Reset form for new meeting
      setFormData({
        date: "",
        time: "",
        timeEnd: "",
        venue: "",
        agenda: "",
        commentLink: "",
      });
      setSelectedDate(undefined);
    }
  }, [meeting]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData((prev) => ({ ...prev, date: format(date, "MMMM d, yyyy") }));
    }
  };

  const handleTimeSelect = (time: string) => {
    setFormData((prev) => ({ ...prev, time }));
    setShowTimePicker(false);
    
    // If end time is not set, default to 30 minutes later
    if (!formData.timeEnd) {
      // Find the index of selected time
      const timeIndex = timeOptions.findIndex(t => t === time);
      if (timeIndex >= 0 && timeIndex < timeOptions.length - 1) {
        // Set end time to the next time slot
        setFormData(prev => ({ ...prev, timeEnd: timeOptions[timeIndex + 1] }));
      }
    }
  };
  
  const handleEndTimeSelect = (timeEnd: string) => {
    setFormData((prev) => ({ ...prev, timeEnd }));
    setShowEndTimePicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate schedule date in ISO format for backend
    let scheduleDate = "";
    if (formData.date) {
      try {
        const dateObj = parse(formData.date, "MMMM d, yyyy", new Date());
        scheduleDate = format(dateObj, "yyyy-MM-dd");
      } catch (error) {
        console.error("Failed to parse date", error);
      }
    }
    
    // Prepare meeting data for submission
    const meetingData: Partial<MeetingUI> = {
      date: formData.date,
      scheduleDate,
      time: formData.time,
      timeStart: formData.time ? convertTo24HourFormat(formData.time) : "",
      timeEnd: formData.timeEnd ? convertTo24HourFormat(formData.timeEnd) : "",
      venue: formData.venue,
      agenda: formData.agenda,
      commentLink: formData.commentLink
    };
    
    // Save and close modal only on success
    const success = await onSave(meetingData);
    if (success) {
      onClose();
    }
  };
  
  // Utility function to convert 12-hour time format to 24-hour format
  function convertTo24HourFormat(time12h: string): string {
    try {
      // Create a date object with the time string
      const timeObj = parse(time12h, "h:mm a", new Date());
      // Format to 24-hour format
      return format(timeObj, "HH:mm");
    } catch (error) {
      console.error("Error converting time format:", error);
      return time12h; // Return original if parsing fails
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-md shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-divider">
          <h2 className="text-subtitle font-medium text-text-primary">
            Add New Meeting
          </h2>
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
            <label
              htmlFor="date"
              className="block text-sm font-medium text-text-primary mb-1"
            >
              Date *
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  id="date"
                  className="input-text w-full flex justify-between items-center text-left"
                >
                  {formData.date || "Select date..."}
                  <Calendar className="h-4 w-4 text-text-secondary" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-0 bg-white border border-divider rounded-md shadow-md z-50">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="p-3"
                />
              </PopoverContent>
            </Popover>
            {/* Hidden input for form validation */}
            <input type="hidden" name="date" value={formData.date} required />
          </div>

          {/* Start Time */}
          <div>
            <label
              htmlFor="time"
              className="block text-sm font-medium text-text-primary mb-1"
            >
              Start Time *
            </label>
            <Popover open={showTimePicker} onOpenChange={setShowTimePicker}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  id="time"
                  className="input-text w-full flex justify-between items-center text-left"
                  onClick={() => setShowTimePicker(true)}
                >
                  {formData.time || "Select start time..."}
                  <Clock className="h-4 w-4 text-text-secondary" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="bg-white border border-divider rounded-md shadow-md p-2 z-50 w-48 max-h-60 overflow-y-auto">
                <div className="grid gap-1">
                  {timeOptions.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={`text-left px-3 py-1.5 rounded-sm hover:bg-blue-50 ${
                        formData.time === time
                          ? "bg-blue-100 text-blue-700"
                          : ""
                      }`}
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            {/* Hidden input for form validation */}
            <input type="hidden" name="time" value={formData.time} required />
          </div>
          
          {/* End Time */}
          <div>
            <label
              htmlFor="timeEnd"
              className="block text-sm font-medium text-text-primary mb-1"
            >
              End Time *
            </label>
            <Popover open={showEndTimePicker} onOpenChange={setShowEndTimePicker}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  id="timeEnd"
                  className="input-text w-full flex justify-between items-center text-left"
                  onClick={() => setShowEndTimePicker(true)}
                >
                  {formData.timeEnd || "Select end time..."}
                  <Clock className="h-4 w-4 text-text-secondary" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="bg-white border border-divider rounded-md shadow-md p-2 z-50 w-48 max-h-60 overflow-y-auto">
                <div className="grid gap-1">
                  {timeOptions.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={`text-left px-3 py-1.5 rounded-sm hover:bg-blue-50 ${
                        formData.timeEnd === time
                          ? "bg-blue-100 text-blue-700"
                          : ""
                      }`}
                      onClick={() => handleEndTimeSelect(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            {/* Hidden input for form validation */}
            <input type="hidden" name="timeEnd" value={formData.timeEnd} required />
          </div>

          {/* Venue */}
          <div>
            <label
              htmlFor="venue"
              className="block text-sm font-medium text-text-primary mb-1"
            >
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
            <label
              htmlFor="agenda"
              className="block text-sm font-medium text-text-primary mb-1"
            >
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
            <label
              htmlFor="commentLink"
              className="block text-sm font-medium text-text-primary mb-1"
            >
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
            <button type="submit" className="btn-primary">
              SAVE MEETING
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingFormModal;
