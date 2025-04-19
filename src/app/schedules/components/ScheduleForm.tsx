"use client";

import { useState } from "react";
import { RichTextEditor } from "@/app/components/rich-text";
import { RichTextContent, Schedule } from "@/types/schedule";

interface ScheduleFormProps {
  schedule?: Schedule;
  onSubmit: (formData: FormData) => Promise<void>;
  isEdit?: boolean;
}

export default function ScheduleForm({
  schedule,
  onSubmit,
  isEdit = false,
}: ScheduleFormProps) {
  const [placeContent, setPlaceContent] = useState<RichTextContent | null>(
    schedule?.place || null
  );
  const [activityContent, setActivityContent] =
    useState<RichTextContent | null>(schedule?.activity || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);

      // Add the rich text content to the form data
      if (placeContent) {
        formData.set("place", JSON.stringify(placeContent));
      }

      if (activityContent) {
        formData.set("activity", JSON.stringify(activityContent));
      }

      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-md">
      <div className="space-y-sm">
        <label
          htmlFor="schedule_date"
          className="block text-text-primary font-medium"
        >
          Date*
        </label>
        <input
          type="date"
          id="schedule_date"
          name="schedule_date"
          defaultValue={schedule?.schedule_date}
          required
          className="w-full p-sm border border-divider rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        <div className="space-y-sm">
          <label
            htmlFor="time_start"
            className="block text-text-primary font-medium"
          >
            Start Time*
          </label>
          <input
            type="time"
            id="time_start"
            name="time_start"
            defaultValue={schedule?.time_range.start}
            required
            className="w-full p-sm border border-divider rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="space-y-sm">
          <label
            htmlFor="time_end"
            className="block text-text-primary font-medium"
          >
            End Time*
          </label>
          <input
            type="time"
            id="time_end"
            name="time_end"
            defaultValue={schedule?.time_range.end}
            required
            className="w-full p-sm border border-divider rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="space-y-sm">
        <label htmlFor="place" className="block text-text-primary font-medium">
          Place
        </label>
        <RichTextEditor
          id="place"
          name="place"
          content={placeContent}
          onChange={setPlaceContent}
          placeholder="Enter place details..."
        />
      </div>

      <div className="space-y-sm">
        <label
          htmlFor="activity"
          className="block text-text-primary font-medium"
        >
          Activity
        </label>
        <RichTextEditor
          id="activity"
          name="activity"
          content={activityContent}
          onChange={setActivityContent}
          placeholder="Describe the activity..."
        />
      </div>

      <div className="space-y-sm">
        <label
          htmlFor="comment_link"
          className="block text-text-primary font-medium"
        >
          Comment Link
        </label>
        <input
          type="url"
          id="comment_link"
          name="comment_link"
          defaultValue={schedule?.comment_link || ""}
          className="w-full p-sm border border-divider rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="https://example.com/comments"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary px-md py-sm rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-70"
        >
          {isSubmitting
            ? "Saving..."
            : isEdit
            ? "Update Schedule"
            : "Create Schedule"}
        </button>
      </div>
    </form>
  );
}
