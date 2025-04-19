"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  Schedule,
  NewSchedule,
  UpdateSchedule,
  ScheduleQueryParams,
  RichTextContent,
} from "@/types/schedule";

/**
 * Parse and sanitize rich text content
 */
function parseRichTextContent(content: string | null): RichTextContent | null {
  if (!content) return null;
  
  try {
    // Parse the JSON string
    const parsed = JSON.parse(content);
    
    // Basic validation to ensure it follows the expected structure
    if (typeof parsed !== 'object' || !parsed.type || parsed.type !== 'doc' || !Array.isArray(parsed.content)) {
      return null;
    }
    
    return parsed as RichTextContent;
  } catch (error) {
    console.error('Failed to parse rich text content:', error);
    return null;
  }
}

/**
 * Create a new schedule entry
 */
export async function createSchedule(formData: FormData) {
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("Authentication required");
  }

  // Parse form data
  const placeContent = parseRichTextContent(formData.get("place") as string);
  const activityContent = parseRichTextContent(formData.get("activity") as string);
  
  const scheduleData: NewSchedule = {
    user_id: user.id,
    schedule_date: formData.get("schedule_date") as string,
    time_range: {
      start: formData.get("time_start") as string,
      end: formData.get("time_end") as string,
    },
    place: placeContent,
    activity: activityContent,
    comment_link: (formData.get("comment_link") as string) || null,
  };

  // Validate required fields
  if (
    !scheduleData.schedule_date ||
    !scheduleData.time_range.start ||
    !scheduleData.time_range.end
  ) {
    throw new Error("Date and time range are required fields");
  }

  // Insert the schedule
  const { data, error } = await supabase
    .from("schedules")
    .insert(scheduleData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create schedule: ${error.message}`);
  }

  // Revalidate the schedule list page
  revalidatePath("/schedules");

  return data;
}

/**
 * Get schedules by date range for the authenticated user
 */
export async function getSchedules(params: ScheduleQueryParams = {}) {
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("Authentication required");
  }

  // Start query builder
  let query = supabase.from("schedules").select("*");

  // Apply date filters if provided
  if (params.startDate) {
    query = query.gte("schedule_date", params.startDate);
  }
  if (params.endDate) {
    query = query.lte("schedule_date", params.endDate);
  }

  // Order by date
  query = query.order("schedule_date", { ascending: true });

  // Apply pagination if specified
  if (params.limit) {
    query = query.limit(params.limit);
  }
  if (params.offset) {
    query = query.range(
      params.offset,
      params.offset + (params.limit || 10) - 1
    );
  }

  // Execute the query
  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch schedules: ${error.message}`);
  }

  return data as Schedule[];
}

/**
 * Get a specific schedule by ID
 */
export async function getScheduleById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("schedules")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch schedule: ${error.message}`);
  }

  return data as Schedule;
}

/**
 * Update an existing schedule
 */
export async function updateSchedule(id: string, formData: FormData) {
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("Authentication required");
  }

  // Ensure the schedule exists and belongs to the user
  const { data: existingSchedule, error: fetchError } = await supabase
    .from("schedules")
    .select("id")
    .eq("id", id)
    .single();

  if (fetchError || !existingSchedule) {
    throw new Error("Schedule not found or access denied");
  }

  // Parse form data - only include fields that were provided
  const updates: UpdateSchedule = {};

  // Get schedule_date if provided
  const scheduleDate = formData.get("schedule_date");
  if (scheduleDate) {
    updates.schedule_date = scheduleDate as string;
  }

  // Get time range if provided
  const timeStart = formData.get("time_start");
  const timeEnd = formData.get("time_end");
  if (timeStart || timeEnd) {
    updates.time_range = {
      start: (timeStart as string) || "",
      end: (timeEnd as string) || "",
    };
  }

  // Parse rich text fields
  const placeFormValue = formData.get("place");
  if (placeFormValue !== null) {
    updates.place = parseRichTextContent(placeFormValue as string);
  }

  const activityFormValue = formData.get("activity");
  if (activityFormValue !== null) {
    updates.activity = parseRichTextContent(activityFormValue as string);
  }

  const commentLink = formData.get("comment_link");
  if (commentLink !== null) {
    updates.comment_link = commentLink as string;
  }

  // Only proceed if there are updates to make
  if (Object.keys(updates).length === 0) {
    return { message: "No changes to update" };
  }

  // Update the schedule
  const { data, error } = await supabase
    .from("schedules")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update schedule: ${error.message}`);
  }

  // Revalidate the schedule list page
  revalidatePath("/schedules");
  revalidatePath(`/schedules/${id}`);

  return data;
}

/**
 * Delete a schedule by ID
 */
export async function deleteSchedule(id: string) {
  const supabase = await createClient();

  // Perform the delete operation
  const { error } = await supabase.from("schedules").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete schedule: ${error.message}`);
  }

  // Revalidate the schedule list page
  revalidatePath("/schedules");

  return { success: true, message: "Schedule deleted successfully" };
}
