
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-md gap-lg">
      <main className="flex flex-col gap-xl items-center max-w-default">
        <h1 className="text-large-heading font-bold text-text-primary">Activity Scheduler</h1>
        
        <p className="text-subtitle text-text-secondary text-center max-w-narrow">
          Your all-in-one solution for organizing daily activities, managing tasks, and optimizing your time.
        </p>

        <div className="flex gap-md items-center flex-col md:flex-row mt-lg">
          <a
            className="btn-primary inline-flex items-center justify-center gap-sm"
            href="/signup"
          >
            Get Started
          </a>
          <a
            className="btn-secondary inline-flex items-center justify-center"
            href="/login"
          >
            Log In
          </a>
        </div>
        
        <div className="mt-xl grid grid-cols-1 md:grid-cols-3 gap-lg">
          <div className="project-card">
            <h3 className="text-title font-semibold mb-sm text-text-primary">Plan Your Day</h3>
            <p className="text-text-secondary">Create and organize tasks with priorities to optimize your daily schedule.</p>
          </div>
          
          <div className="project-card">
            <h3 className="text-title font-semibold mb-sm text-text-primary">Track Progress</h3>
            <p className="text-text-secondary">Monitor your achievements and see how productive your day has been.</p>
          </div>
          
          <div className="project-card">
            <h3 className="text-title font-semibold mb-sm text-text-primary">Stay Focused</h3>
            <p className="text-text-secondary">Set reminders and eliminate distractions to accomplish more.</p>
          </div>
        </div>
      </main>
      
      <footer className="mt-auto pt-xl text-sm text-text-secondary">
        <p>&copy; {new Date().getFullYear()} Activity Scheduler. All rights reserved.</p>
      </footer>
    </div>
  );
}
