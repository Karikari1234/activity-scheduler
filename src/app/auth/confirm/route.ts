import { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");

  // Use NextResponse instead of next/navigation redirect
  if (!token_hash && !code) {
    return NextResponse.redirect(new URL("/error", request.url));
  }

  const supabase = await createClient();
  let error;

  // Handle email confirmation via code (linktype)
  if (code) {
    const result = await supabase.auth.exchangeCodeForSession(code);
    error = result.error;

    // Debug log
    //console.log("Exchange code result:", result);
  }
  // Handle OTP verification
  else if (token_hash && type) {
    const result = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    error = result.error;

    // Debug log
    console.log("OTP verification result:", result);
  }

  if (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(
      new URL(`/login?error=${error.message}`, request.url)
    );
  }

  // Confirm session is established
  const { data: session } = await supabase.auth.getSession();
  console.log(
    "Session after verification:",
    session?.session ? "exists" : "missing"
  );

  if (!session?.session) {
    return NextResponse.redirect(
      new URL("/login?error=session_not_established", request.url)
    );
  }

  // If we get here, session is established
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
