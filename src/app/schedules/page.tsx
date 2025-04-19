import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getSchedules } from "./actions";
import Link from "next/link";
import { RichTextDisplay } from "../components/rich-text";

export default async function SchedulesPage() {
  const supabase = await createClient();

  // Check authentication
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  // Fetch schedules for the authenticated user
  const schedules = await getSchedules({ limit: 20 });

  return (
    <div className="max-w-4xl mx-auto p-md">
      <div className="flex justify-between items-center mb-lg">
        <h1 className="text-heading font-bold">Your Schedules</h1>
        <Link
          href="/schedules/new"
          className="bg-primary text-white px-md py-sm rounded-md hover:bg-opacity-90"
        >
          Create New Schedule
        </Link>
      </div>
      
      {schedules.length === 0 ? (
        <div className="bg-surface p-xl rounded-md shadow-sm text-center">
          <p className="text-text-secondary mb-md">You don&apos;t have any schedules yet.</p>
          <Link
            href="/schedules/new"
            className="text-primary hover:underline"
          >
            Create your first schedule
          </Link>
        </div>
      ) : (
        <div className="space-y-md">
          {schedules.map((schedule) => (
            <Link 
              key={schedule.id} 
              href={`/schedules/${schedule.id}`}
              className="block bg-surface p-md rounded-md shadow-sm hover:shadow transition-shadow"
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="text-subtitle font-medium text-text-primary">
                    {new Date(schedule.schedule_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </h2>
                  <p className="text-text-secondary">
                    {schedule.time_range.start} - {schedule.time_range.end}
                  </p>
                </div>
                
                <div className="flex items-center">
                  <span className="material-icons text-text-secondary">chevron_right</span>
                </div>
              </div>
              
              <div className="mt-sm grid grid-cols-1 md:grid-cols-2 gap-md">
                <div>
                  <h3 className="text-sm font-medium text-text-secondary mb-xs">Place</h3>
                  <div className="line-clamp-2">
                    <RichTextDisplay content={schedule.place} />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-text-secondary mb-xs">Activity</h3>
                  <div className="line-clamp-2">
                    <RichTextDisplay content={schedule.activity} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
