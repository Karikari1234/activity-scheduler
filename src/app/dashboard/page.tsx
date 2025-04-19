import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LogoutButton from "../components/LogoutButton";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className="max-w-default mx-auto p-lg">
      <header className="mb-xl flex justify-between items-center">
        <div>
          <h1 className="text-heading font-bold mb-sm text-text-primary">Dashboard</h1>
          <p className="text-text-secondary">Welcome, {data.user.email}</p>
        </div>
        <div>
          <LogoutButton />
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
        <div className="project-card bg-surface p-md rounded-md">
          <h2 className="text-title font-semibold mb-sm text-text-primary">Today&apos;s Tasks</h2>
          <p className="text-text-secondary">You have no tasks scheduled for today.</p>
          <Link href="/schedules/new" className="text-primary inline-block hover:underline mt-md">Add Schedule</Link>
        </div>
        
        <div className="project-card bg-surface p-md rounded-md">
          <h2 className="text-title font-semibold mb-sm text-text-primary">Upcoming</h2>
          <p className="text-text-secondary">No upcoming schedules in the next 7 days.</p>
          <Link href="/schedules" className="text-primary inline-block hover:underline mt-md">View Schedules</Link>
        </div>
        
        <div className="project-card bg-surface p-md rounded-md">
          <h2 className="text-title font-semibold mb-sm text-text-primary">Activities</h2>
          <p className="text-text-secondary">Manage your activities with rich text formatting.</p>
          <Link href="/schedules" className="text-primary inline-block hover:underline mt-md">Manage Activities</Link>
        </div>
      </div>
      
      <section className="mb-xl">
        <div className="flex justify-between items-center mb-md">
          <h2 className="text-title font-semibold text-text-primary">Activity</h2>
          <button className="btn-secondary">View All</button>
        </div>
        
        <div className="bg-surface rounded-md p-lg">
          <p className="text-text-secondary text-center py-xl">No recent activity to display.</p>
        </div>
      </section>
    </div>
  );
}