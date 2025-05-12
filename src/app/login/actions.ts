"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  //const { data: profileData, error: profileError } =
  //console.log(await supabase.from("user_info_flag").select("profile_update").eq("id", supabase.from("users").select("id").eq("email", data.email)).single())

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  
  if (authError || !user) {
    // handle error (e.g., redirect to login)
    return;
  }

  // Step 2: Get profile_update for that user ID
  const { data: profileData, error: profileError } = await supabase
    .from("user_info_flag")
    .select("profile_update")
    .eq("id", user.id)
    .single();


  if (profileError) {
    // handle error (e.g., redirect to error page)
    redirect("/error");
  }
  if (!profileData.profile_update) {
    redirect("/profile");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
