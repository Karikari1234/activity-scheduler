/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/app/components/rich-text";
import { TimeRangePicker } from "./TimeRangePicker";
import { DatePickerWithCalendar } from "./DatePickerWithCalendar";
import { Schedule, RichTextContent } from "@/types/schedule";
import { useScheduleStore } from "@/stores/scheduleStore";
import { useScheduleUIStore } from "@/stores/scheduleUIStore";

interface FormValues {
  commentLink: string;
}

interface ScheduleFormModalProps {
  schedule?: Schedule;
  isEdit?: boolean;
  trigger: React.ReactNode;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ScheduleFormModal({
  schedule,
  isEdit = false,
  trigger,
  onSuccess,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: ScheduleFormModalProps) {
  const { createSchedule, updateSchedule, loading, error } = useScheduleStore();
  
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Determine if we're using controlled or uncontrolled mode
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen : setInternalOpen;
  
  // State for date and times
  const [date, setDate] = React.useState<Date | undefined>(
    schedule ? new Date(schedule.schedule_date) : new Date()
  );
  
  const [startTime, setStartTime] = React.useState<Date | undefined>(
    schedule 
      ? new Date(`1970-01-01T${schedule.time_range.start}:00`) 
      : new Date()
  );
  
  const [endTime, setEndTime] = React.useState<Date | undefined>(
    schedule 
      ? new Date(`1970-01-01T${schedule.time_range.end}:00`) 
      : new Date(new Date().setHours(new Date().getHours() + 1))
  );
  
  // State for rich text content
  const [placeContent, setPlaceContent] = React.useState<RichTextContent | null>(
    schedule?.place || null
  );
  
  const [activityContent, setActivityContent] = React.useState<RichTextContent | null>(
    schedule?.activity || null
  );
  
  // Validation errors
  const [dateError, setDateError] = React.useState<string | null>(null);
  const [timeError, setTimeError] = React.useState<string | null>(null);
  const [placeError, setPlaceError] = React.useState<string | null>(null);
  const [activityError, setActivityError] = React.useState<string | null>(null);
  
  // Form for handling validation on commentLink
  const form = useForm<FormValues>({
    defaultValues: {
      commentLink: schedule?.comment_link || "",
    },
  });

  // Reset form and state when schedule prop changes or modal opens/closes
  React.useEffect(() => {
    if (open) {
      // Reset errors
      setDateError(null);
      setTimeError(null);
      setPlaceError(null);
      setActivityError(null);
      
      // Update form values when schedule changes
      if (schedule) {
        form.reset({
          commentLink: schedule.comment_link || "",
        });
        setDate(new Date(schedule.schedule_date));
        setStartTime(new Date(`1970-01-01T${schedule.time_range.start}:00`));
        setEndTime(new Date(`1970-01-01T${schedule.time_range.end}:00`));
        setPlaceContent(schedule.place);
        setActivityContent(schedule.activity);
      } else {
        form.reset({
          commentLink: "",
        });
        setDate(new Date());
        setStartTime(new Date());
        setEndTime(new Date(new Date().setHours(new Date().getHours() + 1)));
        setPlaceContent(null);
        setActivityContent(null);
      }
    }
  }, [open, schedule, form]);

  // Form submission handler
  const onSubmit = async (values: FormValues) => {
    // Reset validation errors
    setDateError(null);
    setTimeError(null);
    setPlaceError(null);
    setActivityError(null);
    
    // Validate required fields
    let hasErrors = false;
    
    if (!date) {
      setDateError("Date is required");
      hasErrors = true;
    }
    
    if (!startTime || !endTime) {
      setTimeError("Start and end times are required");
      hasErrors = true;
    } else if (
      startTime.getHours() > endTime.getHours() || 
      (startTime.getHours() === endTime.getHours() && startTime.getMinutes() >= endTime.getMinutes())
    ) {
      setTimeError("End time must be after start time");
      hasErrors = true;
    }
    
    if (!placeContent) {
      setPlaceError("Place is required");
      hasErrors = true;
    }
    
    if (!activityContent) {
      setActivityError("Activity is required");
      hasErrors = true;
    }
    
    if (hasErrors) return;
    
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      
      // Format date as YYYY-MM-DD
      if (date) {
        const dateString = date.toISOString().split('T')[0];
        formData.append("schedule_date", dateString);
      }
      
      // Format times as HH:MM
      if (startTime && endTime) {
        const formatTimeValue = (date: Date) => {
          return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        };
        
        formData.append("time_start", formatTimeValue(startTime));
        formData.append("time_end", formatTimeValue(endTime));
      }
      
      // Add rich text content
      if (placeContent) {
        formData.append("place", JSON.stringify(placeContent));
      }
      
      if (activityContent) {
        formData.append("activity", JSON.stringify(activityContent));
      }
      
      // Add comment link if provided
      if (values.commentLink) {
        formData.append("comment_link", values.commentLink);
      }
      
      let result;
      if (isEdit && schedule) {
        // Update existing schedule using our store action
        result = await updateSchedule(schedule.id, formData);
      } else {
        // Create new schedule using our store action
        result = await createSchedule(formData);
      }
      
      if (result) {
        // Close modal and trigger success callback
        setOpen(false);
        if (onSuccess) onSuccess();
      }
      
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Schedule" : "Add New Schedule"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Make changes to your schedule."
              : "Create a new schedule for your activities."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 p-3 rounded-md mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <FormLabel className="text-sm font-medium">Date *</FormLabel>
              <DatePickerWithCalendar
                date={date}
                setDate={setDate}
              />
              {dateError && (
                <p className="text-destructive text-sm">{dateError}</p>
              )}
            </div>

            {/* Time Range Picker */}
            <div className="space-y-2">
              <FormLabel className="text-sm font-medium">Time Range *</FormLabel>
              <TimeRangePicker
                startDate={startTime}
                endDate={endTime}
                setStartDate={setStartTime}
                setEndDate={setEndTime}
              />
              {timeError && (
                <p className="text-destructive text-sm">{timeError}</p>
              )}
            </div>

            {/* Place - Rich Text */}
            <div className="space-y-2">
              <FormLabel className="text-sm font-medium">Place * (বাংলা লিখতে পারেন)</FormLabel>
              <RichTextEditor
                content={placeContent}
                onChange={setPlaceContent}
                placeholder="Enter place details..."
              />
              {placeError && (
                <p className="text-destructive text-sm">{placeError}</p>
              )}
            </div>

            {/* Activity - Rich Text */}
            <div className="space-y-2">
              <FormLabel className="text-sm font-medium">Activity * (বাংলা লিখতে পারেন)</FormLabel>
              <RichTextEditor
                content={activityContent}
                onChange={setActivityContent}
                placeholder="Describe the activity..."
              />
              {activityError && (
                <p className="text-destructive text-sm">{activityError}</p>
              )}
            </div>

            {/* Comment Link */}
            <FormField
              control={form.control}
              name="commentLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment Link (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/docs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || loading}>
                {isSubmitting || loading ? 'Saving...' : isEdit ? 'Update Schedule' : 'Create Schedule'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
