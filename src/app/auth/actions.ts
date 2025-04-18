"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  
  // Sign out the user (defaults to 'global' scope which terminates all sessions)
  await supabase.auth.signOut();
  
  // Revalidate all pages that use the user session
  revalidatePath("/", "layout");
  
  // Redirect to login page
  redirect("/login");
}
