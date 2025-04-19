import { redirect, notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getScheduleById } from "../actions";
import ScheduleDetail from "../components/ScheduleDetail";
import Link from "next/link";

interface SchedulePageProps {
  params: Promise<{ id: string }>;
}

export default async function SchedulePage({ params }: SchedulePageProps) {
  const supabase = await createClient();

  // Check authentication
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  try {
    // Fetch the schedule by ID
    const schedule = await getScheduleById((await params).id);

    return (
      <div className="max-w-2xl mx-auto p-md">
        <div className="flex justify-between items-center mb-lg">
          <h1 className="text-heading font-bold">Schedule Details</h1>
          <div className="flex gap-sm">
            <Link
              href={`/schedules/${(await params).id}/edit`}
              className="bg-primary text-white px-md py-sm rounded-md hover:bg-opacity-90"
            >
              Edit
            </Link>
            <Link
              href="/schedules"
              className="text-primary hover:underline py-sm px-md"
            >
              Back to Schedules
            </Link>
          </div>
        </div>

        <ScheduleDetail schedule={schedule} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching schedule:", error);
    notFound();
  }
}
