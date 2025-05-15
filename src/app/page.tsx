/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Home() {
  const supabase = createClient();
  const [profileName, setProfileName] = useState("");
  const [meetingStats, setMeetingStats] = useState({
    past: 0,
    today: 0,
    upcoming: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

      if (!profileError && profile?.name) {
        setProfileName(profile.name);
      }

      const today = new Date();
      const startOfToday = new Date(today.setHours(0, 0, 0, 0));
      const endOfToday = new Date(today.setHours(23, 59, 59, 999));

      const { data: meetings, error: meetingsError } = await supabase
        .from("schedules")
        .select("schedule_date")
        .eq("user_id", user.id);

      // console.log(meetings, today);
      if (!meetingsError && meetings) {
        const stats = { past: 0, today: 0, upcoming: 0 };

        meetings.forEach(({ schedule_date }: any) => {
          const meetingDate = new Date(schedule_date);

          const isSameDay =
            meetingDate.getFullYear() === today.getFullYear() &&
            meetingDate.getMonth() === today.getMonth() &&
            meetingDate.getDate() === today.getDate();

          if (meetingDate < startOfToday) {
            stats.past++;
          } else if (isSameDay) {
            stats.today++;
          } else if (meetingDate > endOfToday) {
            stats.upcoming++;
          }
        });

        setMeetingStats(stats);
      }
    };

    fetchData();
  }, [supabase]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-md gap-12">
      <main className="flex flex-col gap-16 items-center w-full max-w-screen-lg">
        {/* Welcome Message */}
        {profileName && (
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-semibold text-text-primary">
              Welcome, {profileName}{" "}
            </h2>
          </div>
        )}

        {/* App Title & Tagline */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary">
            Activity Scheduler
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
            Your all-in-one solution for organizing daily activities, managing
            tasks, and optimizing your time.
          </p>
        </div>

        {/* Action Buttons */}
        {/* <div className="flex gap-4 items-center flex-col md:flex-row">
          <a className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3" href="/new-meeting">
            + New Meeting
          </a>
        </div> */}

        {/* Meeting Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-2">
          <a href="/schedules">
          <div className="project-card text-center py-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Past Meetings
            </h3>
            <p className="text-4xl font-bold text-text-accent">
              {meetingStats.past}
            </p>
          </div>
          </a>

          <a href="/dashboard">
          <div className="project-card text-center py-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Today's Meetings
            </h3>
            <p className="text-4xl font-bold text-text-accent">
              {meetingStats.today}
            </p>
          </div>
          </a>

          <a href="/schedules">
          <div className="project-card text-center py-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Upcoming Meetings
            </h3>
            <p className="text-4xl font-bold text-text-accent">
              {meetingStats.upcoming}
            </p>
          </div>
          </a>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-10">
          <div className="project-card p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Plan Your Day
            </h3>
            <p className="text-text-secondary">
              Create and organize tasks with priorities to optimize your daily
              schedule.
            </p>
          </div>

          <div className="project-card p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Track Progress
            </h3>
            <p className="text-text-secondary">
              Monitor your achievements and see how productive your day has
              been.
            </p>
          </div>

          <div className="project-card p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Stay Focused
            </h3>
            <p className="text-text-secondary">
              Set reminders and eliminate distractions to accomplish more.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="pt-12 text-sm text-text-secondary text-center">
        <p>
          &copy; {new Date().getFullYear()} Activity Scheduler. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
