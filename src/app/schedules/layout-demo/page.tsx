import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getSchedules } from "../actions";
import { ScheduleLayoutWithData } from "./ScheduleLayoutWithData";
import { Schedule } from "@/types/schedule";

export default async function ScheduleLayoutDemo() {
  const supabase = await createClient();

  // Check authentication
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  // Fetch schedules for the authenticated user
  let schedules: Schedule[] = [];
  try {
    schedules = await getSchedules({ limit: 20 });
  } catch (error) {
    console.error("Error fetching schedules:", error);
  }

  return (
    <div className="container mx-auto">
      <ScheduleLayoutWithData schedules={schedules} />
    </div>
  );
}
