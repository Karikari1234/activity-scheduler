import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LogoutButton from "../components/LogoutButton";

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
        <div className="project-card">
          <h2 className="text-title font-semibold mb-sm text-text-primary">Today&apos;s Tasks</h2>
          <p className="text-text-secondary">You have no tasks scheduled for today.</p>
          <button className="btn-text mt-md">Add Task</button>
        </div>
        
        <div className="project-card">
          <h2 className="text-title font-semibold mb-sm text-text-primary">Upcoming</h2>
          <p className="text-text-secondary">No upcoming tasks in the next 7 days.</p>
          <button className="btn-text mt-md">View Calendar</button>
        </div>
        
        <div className="project-card">
          <h2 className="text-title font-semibold mb-sm text-text-primary">Projects</h2>
          <p className="text-text-secondary">You have no active projects.</p>
          <button className="btn-text mt-md">Create Project</button>
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