"use client";

import { format, parse } from "date-fns";
import { Schedule, RichTextContent } from "@/types/schedule";

/**
 * Frontend meeting interface that matches the UI components
 */
export interface MeetingUI {
  id: string;
  date: string; // Display format: "May 7, 2025"
  scheduleDate: string; // ISO format: "2025-05-07"
  time: string; // Display format: "10:30 AM"
  timeStart: string; // 24h format: "10:30"
  timeEnd: string; // 24h format: "11:30"
  venue: string; // Plain text extracted from rich content
  placeContent: RichTextContent | null; // Rich text for backend
  agenda: string; // Plain text extracted from rich content
  activityContent: RichTextContent | null; // Rich text for backend
  commentLink: string;
}

/**
 * Extract plain text from rich text content
 */
export function extractPlainText(richContent: RichTextContent | null): string {
  if (!richContent) return "";

  try {
    // Concatenate all text nodes from all paragraphs
    const textParts: string[] = [];
    
    richContent.content.forEach(node => {
      if (node.type === 'paragraph' && node.content) {
        node.content.forEach(textNode => {
          if (textNode.type === 'text') {
            textParts.push(textNode.text);
          }
        });
      }
    });
    
    return textParts.join(" ");
  } catch (error) {
    console.error("Error extracting plain text:", error);
    return "";
  }
}

/**
 * Create a basic rich text content object from plain text
 */
export function createRichTextContent(text: string): RichTextContent {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: text
          }
        ]
      }
    ]
  };
}

/**
 * Convert a backend Schedule to frontend MeetingUI format
 */
export function scheduleToMeetingUI(schedule: Schedule): MeetingUI {
  // Parse the ISO date to a display format
  const scheduleDate = schedule.schedule_date;
  const dateObj = new Date(scheduleDate);
  const displayDate = format(dateObj, "MMMM d, yyyy");
  
  // Extract time information
  const timeStart = schedule.time_range.start || "";
  const timeEnd = schedule.time_range.end || "";
  
  // Format display time (use start time for display)
  let displayTime = "";
  try {
    if (timeStart) {
      // Parse HH:MM format to get hours and minutes
      const [hours, minutes] = timeStart.split(":");
      const timeObj = new Date();
      timeObj.setHours(parseInt(hours), parseInt(minutes));
      displayTime = format(timeObj, "h:mm a"); // Format as "10:30 AM"
    }
  } catch (error) {
    console.error("Error formatting time:", error);
    displayTime = timeStart; // Fallback to original format
  }
  
  // Extract plain text from rich content
  const venue = extractPlainText(schedule.place);
  const agenda = extractPlainText(schedule.activity);
  
  return {
    id: schedule.id,
    date: displayDate,
    scheduleDate,
    time: displayTime,
    timeStart,
    timeEnd,
    venue,
    placeContent: schedule.place,
    agenda,
    activityContent: schedule.activity,
    commentLink: schedule.comment_link || ""
  };
}

/**
 * Convert 12-hour time format (10:30 AM) to 24-hour format (10:30)
 */
export function convertTo24HourFormat(time12h: string): string {
  try {
    // Create a date object with the time string
    const timeObj = parse(time12h, "h:mm a", new Date());
    // Format to 24-hour format
    return format(timeObj, "HH:mm");
  } catch (error) {
    console.error("Error converting time format:", error);
    return time12h; // Return original if parsing fails
  }
}

/**
 * Convert MM/DD/YYYY format to ISO date format YYYY-MM-DD
 */
export function convertToISODate(dateStr: string): string {
  try {
    // Parse the date string to a Date object
    const dateObj = parse(dateStr, "MM/dd/yyyy", new Date());
    // Format to ISO date format
    return format(dateObj, "yyyy-MM-dd");
  } catch (error) {
    console.error("Error converting date format:", error);
    return dateStr; // Return original if parsing fails
  }
}

/**
 * Convert display date format (May 7, 2025) to ISO date (2025-05-07)
 */
export function displayDateToISO(displayDate: string): string {
  try {
    // Parse the display date to a Date object
    const dateObj = parse(displayDate, "MMMM d, yyyy", new Date());
    // Format to ISO date
    return format(dateObj, "yyyy-MM-dd");
  } catch (error) {
    console.error("Error converting display date to ISO:", error);
    return ""; // Return empty string if parsing fails
  }
}

/**
 * Prepare form data for backend submission from MeetingUI object
 */
export function prepareMeetingFormData(meeting: Partial<MeetingUI>): FormData {
  const formData = new FormData();
  
  // Add schedule date (convert from display format if needed)
  if (meeting.scheduleDate) {
    formData.append("schedule_date", meeting.scheduleDate);
  } else if (meeting.date) {
    formData.append("schedule_date", displayDateToISO(meeting.date));
  }
  
  // Add time range
  if (meeting.timeStart) {
    formData.append("time_start", meeting.timeStart);
  } else if (meeting.time) {
    formData.append("time_start", convertTo24HourFormat(meeting.time));
  }
  
  if (meeting.timeEnd) {
    formData.append("time_end", meeting.timeEnd);
  } else if (meeting.timeStart) {
    // Default to 1 hour later if end time not specified
    formData.append("time_end", meeting.timeStart);
  }
  
  // Add place as rich text content
  if (meeting.placeContent) {
    formData.append("place", JSON.stringify(meeting.placeContent));
  } else if (meeting.venue) {
    formData.append("place", JSON.stringify(createRichTextContent(meeting.venue)));
  }
  
  // Add activity as rich text content
  if (meeting.activityContent) {
    formData.append("activity", JSON.stringify(meeting.activityContent));
  } else if (meeting.agenda) {
    formData.append("activity", JSON.stringify(createRichTextContent(meeting.agenda)));
  }
  
  // Add comment link
  if (meeting.commentLink) {
    formData.append("comment_link", meeting.commentLink);
  }
  
  return formData;
}