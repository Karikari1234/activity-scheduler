"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { getSchedules } from "../../actions";
import RichTextDisplay from "@/app/components/rich-text/RichTextDisplay";
import { Calendar } from "lucide-react";

// Define the Schedule type based on your actual data structure
interface Schedule {
  id: string;
  schedule_date: string;
  time_range: {
    start: string;
    end: string;
  };
  place: any; // Rich text content
  activity: any; // Rich text content
  comment_link?: string;
}

interface ScheduleManagerProps {
  onDateChange?: (date: string | undefined) => void;
  onSchedulesUpdate?: (schedules: Schedule[]) => void;
}

export default function ScheduleManager({ onDateChange, onSchedulesUpdate }: ScheduleManagerProps) {
  const [filterDate, setFilterDate] = useState<string>("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Add a ref to track if this is the initial mount
  const isInitialMount = useRef(true);

  // Function to format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch(e) {
      console.error("Date format error:", dateString, e);
      return dateString;
    }
  };

  // Function to format time in a nicer way
  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    try {
      const [hours, minutes] = timeString.split(':');
      const h = parseInt(hours, 10);
      const m = parseInt(minutes, 10);
      if (isNaN(h) || isNaN(m)) return timeString;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formattedHours = h % 12 === 0 ? 12 : h % 12;
      const formattedMinutes = m < 10 ? '0' + m : m;
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    } catch (e) {
      console.error("Time format error:", timeString, e);
      return timeString;
    }
  };

  // Load schedules once on component mount or when filter changes
  useEffect(() => {
    const loadSchedules = async () => {
      // Don't show loading indicator on initial mount to prevent flicker
      if (!isInitialMount.current) {
        setLoading(true);
      }
      
      try {
        // Use the server action to fetch schedules
        const params = filterDate 
          ? { startDate: filterDate, endDate: filterDate }
          : { limit: 20 };
        
        const data = await getSchedules(params);
        setSchedules(data);
        
        // Notify parent component about the schedules
        if (onSchedulesUpdate) {
          onSchedulesUpdate(data);
        }
      } catch (error) {
        console.error("Failed to load schedules:", error);
      } finally {
        setLoading(false);
        if (isInitialMount.current) {
          isInitialMount.current = false;
        }
      }
    };

    loadSchedules();
    
    // Only include filterDate in the dependency array
  }, [filterDate]);

  // Handle filter date change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setFilterDate(newDate);
    
    // Notify parent component about the date change
    if (onDateChange) {
      onDateChange(newDate || undefined);
    }
  };

  // Clear the filter
  const clearFilter = () => {
    setFilterDate("");
    
    // Notify parent component about the date change
    if (onDateChange) {
      onDateChange(undefined);
    }
  };

  return (
    <div className="h-full p-md">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-heading font-bold text-text-primary mb-lg">Schedule Manager</h1>
        
        <div className="flex justify-between items-center mb-lg flex-wrap gap-md">
          <Link href="/schedules/new">
            <Button className="bg-primary text-white hover:bg-primary-dark">
              Add New Schedule
            </Button>
          </Link>
          
          <div className="flex items-center gap-sm">
            <div className="flex items-center gap-sm">
              <label htmlFor="filterDate" className="text-text-secondary font-medium">Filter by Date:</label>
              <div className="relative">
                <Input 
                  type="date" 
                  id="filterDate" 
                  className="w-auto pr-9"
                  value={filterDate}
                  onChange={handleFilterChange}
                />
                <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5 pointer-events-none" />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 w-9 p-0 rounded-full" 
                title="Clear Filter"
                onClick={clearFilter}
                disabled={!filterDate}
              >
                ×
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-md">
          {loading ? (
            <div className="bg-surface p-lg rounded-md shadow-sm text-center">
              <p className="text-text-secondary">Loading schedules...</p>
            </div>
          ) : schedules.length === 0 ? (
            <div className="bg-surface p-lg rounded-md shadow-sm text-center">
              <p className="text-text-secondary">
                {filterDate 
                  ? `No schedules found for ${formatDate(filterDate)}.` 
                  : "No schedules found. Add one to get started!"}
              </p>
              <Link href="/schedules/new" className="text-primary hover:underline mt-md inline-block">
                Create your first schedule
              </Link>
            </div>
          ) : (
            schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-surface rounded-md overflow-hidden border border-divider hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col">
                  <div className="bg-primary-light px-md py-sm border-b border-divider">
                    <h2 className="text-lg font-medium text-primary">
                      {formatDate(schedule.schedule_date)}
                    </h2>
                    <p className="text-text-secondary font-medium">
                      {formatTime(schedule.time_range.start)} - {formatTime(schedule.time_range.end)}
                    </p>
                  </div>
                  
                  <div className="p-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                      <div>
                        <h3 className="text-sm font-medium text-text-secondary mb-xs uppercase tracking-wide">Place</h3>
                        <div className="prose prose-sm max-w-none text-text-primary">
                          <RichTextDisplay content={schedule.place} />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-text-secondary mb-xs uppercase tracking-wide">Activity</h3>
                        <div className="prose prose-sm max-w-none text-text-primary">
                          <RichTextDisplay content={schedule.activity} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-md flex justify-end">
                      <Link href={`/schedules/${schedule.id}`}>
                        <Button variant="outline" size="sm" className="text-primary">
                          View Details →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
