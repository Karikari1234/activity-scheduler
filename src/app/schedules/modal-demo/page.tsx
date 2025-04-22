"use client";

import { Button } from "@/components/ui/button";
import { ScheduleFormModal } from "../components/modal";

export default function ModalDemoPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-heading font-bold mb-6">Schedule Form Modal Demo</h1>
      
      <div className="grid gap-4">
        <div className="p-4 border border-divider rounded-md">
          <h2 className="text-subtitle font-medium mb-4">Add New Schedule</h2>
          <ScheduleFormModal 
            trigger={<Button>Open Add Schedule Modal</Button>}
            onSuccess={() => {
              alert("Schedule created successfully!");
            }}
          />
          <p className="mt-2 text-text-secondary text-sm">
            Click the button above to open the add schedule modal
          </p>
        </div>
        
        <div className="p-4 border border-divider rounded-md">
          <h2 className="text-subtitle font-medium mb-4">Edit Schedule</h2>
          <ScheduleFormModal 
            isEdit={true}
            schedule={{
              id: "mock-id",
              user_id: "mock-user",
              schedule_date: "2025-04-25",
              time_range: {
                start: "09:00",
                end: "10:30"
              },
              place: {
                type: "doc",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Conference Room 1"
                      }
                    ]
                  }
                ]
              },
              activity: {
                type: "doc",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Weekly Team Meeting"
                      }
                    ]
                  }
                ]
              },
              comment_link: "https://example.com/meeting-notes",
              created_at: "2025-04-20T12:00:00Z",
              updated_at: "2025-04-20T12:00:00Z"
            }}
            trigger={<Button variant="outline">Open Edit Schedule Modal</Button>}
            onSuccess={() => {
              alert("Schedule updated successfully!");
            }}
          />
          <p className="mt-2 text-text-secondary text-sm">
            Click the button above to open the edit schedule modal with pre-filled data
          </p>
        </div>
      </div>
    </div>
  );
}
