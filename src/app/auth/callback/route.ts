// src/app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server' // Use server client
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = createClient() // Create server client instance
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
        console.error("Error exchanging code for session:", error.message);
        // Redirect to an error page or login page with an error message
         return NextResponse.redirect(`${origin}/login?message=Could not authenticate user`);
    }
  } else {
      console.error("No code found in callback URL");
       // Redirect to an error page or login page with an error message
      return NextResponse.redirect(`${origin}/login?message=Authentication failed`);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}/dashboard`)
}