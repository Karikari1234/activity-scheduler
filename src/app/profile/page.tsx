import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { updateProfile, updateEmail } from "./actions";
import LogoutButton from "../components/LogoutButton";

// Define the proper Next.js 15 page props interface with Promise types
type PageProps = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProfilePage({ searchParams }: PageProps) {
  // Await the searchParams Promise
  const resolvedSearchParams = await searchParams;
  const supabase = await createClient();

  // Get authenticated user
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  // Get profile data
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    // PGRST116 is "No rows returned" error, which may happen if profile doesn't exist yet
    console.error("Error fetching profile:", profileError);
  }

  // Create profile if it doesn't exist
  if (!profile) {
    const { error: insertError } = await supabase
      .from("profiles")
      .insert([{ id: data.user.id }]);

    if (insertError) {
      console.error("Error creating profile:", insertError);
    }
  }

  const updated = resolvedSearchParams.updated as string | undefined;
  const emailVerificationSent = resolvedSearchParams.email_verification_sent as string | undefined;

  return (
    <div className="max-w-narrow mx-auto my-xl p-lg">
      <header className="mb-xl flex justify-between items-center">
        <div>
          <h1 className="text-heading font-bold mb-sm text-text-primary">Profile</h1>
          <p className="text-text-secondary">Manage your account settings</p>
        </div>
        <div>
          <LogoutButton />
        </div>
      </header>

      {updated && (
        <div className="mb-lg p-md bg-surface border-l-4 border-primary text-text-primary">
          Profile updated successfully.
        </div>
      )}

      {emailVerificationSent && (
        <div className="mb-lg p-md bg-surface border-l-4 border-primary text-text-primary">
          Email verification link sent. Please check your inbox to confirm your new email address.
        </div>
      )}

      <div className="mb-xl">
        <h2 className="text-title font-semibold mb-md text-text-primary">Email Address</h2>
        <form className="flex flex-col gap-md">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-text-primary font-medium mb-xs">Email:</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              defaultValue={data.user.email}
              className="input-text w-full" 
            />
            <p className="text-xs text-text-secondary mt-xs">
              Changing your email requires verification of the new address
            </p>
          </div>
          <button 
            formAction={updateEmail}
            className="btn-primary w-full mt-sm"
          >
            Update Email
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-title font-semibold mb-md text-text-primary">Profile Information</h2>
        <form className="flex flex-col gap-md">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-text-primary font-medium mb-xs">Full Name:</label>
            <input 
              id="name" 
              name="name" 
              type="text"
              defaultValue={profile?.name || ""}
              className="input-text w-full" 
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone_number" className="text-text-primary font-medium mb-xs">Phone Number:</label>
            <input 
              id="phone_number" 
              name="phone_number" 
              type="tel"
              defaultValue={profile?.phone_number || ""}
              className="input-text w-full" 
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="designation" className="text-text-primary font-medium mb-xs">Designation:</label>
            <input 
              id="designation" 
              name="designation" 
              type="text"
              defaultValue={profile?.designation || ""}
              className="input-text w-full" 
            />
          </div>
          <button 
            formAction={updateProfile}
            className="btn-primary w-full mt-md"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
