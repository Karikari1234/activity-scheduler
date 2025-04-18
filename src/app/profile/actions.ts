"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  
  // Get currently authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    redirect("/login");
  }
  
  // Get form data
  const name = formData.get("name") as string;
  const phone_number = formData.get("phone_number") as string;
  const designation = formData.get("designation") as string;
  
  // Update profile in profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ 
      name, 
      phone_number, 
      designation,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);
  
  if (profileError) {
    console.error("Error updating profile:", profileError);
    redirect("/error");
  }
  
  revalidatePath("/profile");
  redirect("/profile?updated=true");
}

export async function updateEmail(formData: FormData) {
  const supabase = await createClient();
  
  const newEmail = formData.get("email") as string;
  
  const { error } = await supabase.auth.updateUser({
    email: newEmail
  });
  
  if (error) {
    console.error("Error updating email:", error);
    redirect("/error");
  }
  
  // Note: Email changes require verification
  // User will receive a confirmation email
  
  revalidatePath("/profile");
  redirect("/profile?email_verification_sent=true");
}
