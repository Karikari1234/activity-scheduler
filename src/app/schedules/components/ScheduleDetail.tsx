'use client';

import { Schedule } from '@/types/schedule';
import { RichTextDisplay } from '@/app/components/rich-text';

interface ScheduleDetailProps {
  schedule: Schedule;
}

export default function ScheduleDetail({ schedule }: ScheduleDetailProps) {
  // Format date for display
  const formattedDate = new Date(schedule.schedule_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <div className="bg-surface p-lg rounded-md shadow-sm">
      <div className="mb-md">
        <h2 className="text-title font-semibold text-primary">{formattedDate}</h2>
        <p className="text-text-secondary">
          {schedule.time_range.start} - {schedule.time_range.end}
        </p>
      </div>
      
      <div className="space-y-md">
        <div>
          <h3 className="text-subtitle font-medium mb-xs">Place</h3>
          <div className="bg-input-bg p-sm rounded-md border border-divider">
            <RichTextDisplay content={schedule.place} />
          </div>
        </div>
        
        <div>
          <h3 className="text-subtitle font-medium mb-xs">Activity</h3>
          <div className="bg-input-bg p-sm rounded-md border border-divider">
            <RichTextDisplay content={schedule.activity} />
          </div>
        </div>
        
        {schedule.comment_link && (
          <div>
            <h3 className="text-subtitle font-medium mb-xs">Comment Link</h3>
            <a 
              href={schedule.comment_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {schedule.comment_link}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
