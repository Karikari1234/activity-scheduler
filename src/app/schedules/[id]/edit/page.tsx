import { redirect, notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ScheduleForm from "../../components/ScheduleForm";
import { getScheduleById, updateSchedule } from "../../actions";
import Link from "next/link";

interface EditSchedulePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSchedulePage({
  params,
}: EditSchedulePageProps) {
  const supabase = await createClient();

  // Check authentication
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  try {
    // Fetch the schedule by ID
    const schedule = await getScheduleById((await params).id);

    // Handle form submission
    const handleUpdateSchedule = async (formData: FormData) => {
      "use server";

      await updateSchedule((await params).id, formData);
      redirect(`/schedules/${(await params).id}`);
    };

    return (
      <div className="max-w-2xl mx-auto p-md">
        <div className="mb-lg">
          <div className="flex justify-between items-center mb-md">
            <h1 className="text-heading font-bold">Edit Schedule</h1>
            <Link
              href={`/schedules/${(await params).id}`}
              className="text-primary hover:underline"
            >
              Cancel
            </Link>
          </div>
          <p className="text-text-secondary">Update your schedule details.</p>
        </div>

        <div className="bg-surface p-lg rounded-md shadow-sm">
          <ScheduleForm
            schedule={schedule}
            onSubmit={handleUpdateSchedule}
            isEdit={true}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching schedule:", error);
    notFound();
  }
}
