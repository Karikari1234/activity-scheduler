import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ScheduleForm from "../components/ScheduleForm";
import { createSchedule } from "../actions";
import Link from "next/link";

export default async function NewSchedulePage() {
  const supabase = await createClient();

  // Check authentication
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  // Handle form submission
  const handleCreateSchedule = async (formData: FormData) => {
    "use server";
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const schedule = await createSchedule(formData);
    redirect("/schedules");
  };

  return (
    <div className="max-w-2xl mx-auto p-md">
      <div className="mb-lg">
        <div className="flex justify-between items-center mb-md">
          <h1 className="text-heading font-bold">Create New Schedule</h1>
          <Link
            href="/schedules"
            className="text-primary hover:underline"
          >
            Back to Schedules
          </Link>
        </div>
        <p className="text-text-secondary">
          Create a new schedule with time, place, and activity details.
        </p>
      </div>
      
      <div className="bg-surface p-lg rounded-md shadow-sm">
        <ScheduleForm onSubmit={handleCreateSchedule} />
      </div>
    </div>
  );
}
