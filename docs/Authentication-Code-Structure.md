# Authentication Code Structure

## Key Files and Their Roles

### Supabase Utility Files

#### `src/utils/supabase/server.ts`
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handle server component calls
          }
        },
      },
    }
  );
}
```

Purpose: Creates a Supabase client for server-side operations that can handle cookies correctly in Next.js server components and server actions.

#### `src/utils/supabase/client.ts`
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

Purpose: Creates a client-side Supabase client for browser operations.

#### `src/utils/supabase/middleware.ts`
```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Initialize response
  let supabaseResponse = NextResponse.next({ request });
  
  // Create client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Cookie handling methods
        // ...
      },
    }
  );

  // Get user
  const { data: { user } } = await supabase.auth.getUser();

  // Check auth status and redirect if needed
  if (!user && !request.nextUrl.pathname.startsWith("/login") /* more conditions */) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

Purpose: Handles session updates in middleware and redirects unauthenticated users from protected routes.

### Authentication Pages

#### `src/app/signup/page.tsx`
```tsx
import { signup } from "./actions";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h1>Sign Up</h1>
      <form>
        {/* Email field */}
        {/* Password field */}
        <button formAction={signup}>Sign up</button>
      </form>
      <p>
        Already have an account?{" "}
        <Link href="/login">Log in</Link>
      </p>
    </div>
  );
}
```

Purpose: Renders the sign-up form UI and links to the server action.

#### `src/app/signup/actions.ts`
```typescript
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();
  
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/confirm`,
    },
  });

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/auth/verify-email");
}
```

Purpose: Server action that processes sign-up form submissions, creates a new user in Supabase Auth, and handles redirects.

#### `src/app/login/page.tsx`
```tsx
import { login } from "./actions";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h1>Log In</h1>
      <form>
        {/* Email field */}
        {/* Password field */}
        <button formAction={login}>Log in</button>
      </form>
      <p>
        Don&apos;t have an account?{" "}
        <Link href="/signup">Sign up</Link>
      </p>
    </div>
  );
}
```

Purpose: Renders the login form UI and links to the server action.

#### `src/app/login/actions.ts`
```typescript
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
```

Purpose: Server action that processes login form submissions, authenticates users via Supabase Auth, and redirects on success.

### Session Management and Logout

#### `src/app/auth/actions.ts`
```typescript
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
```

Purpose: Server action that handles user logout, terminating the session and redirecting to the login page.

#### `src/app/components/LogoutButton.tsx`
```typescript
"use client";

import { signOut } from "../auth/actions";

export default function LogoutButton() {
  return (
    <form>
      <button 
        formAction={signOut}
        className="text-primary hover:underline font-medium"
      >
        Logout
      </button>
    </form>
  );
}
```

Purpose: Client component that provides a button to trigger the signOut server action.

### Protected Routes and Email Confirmation

#### `src/app/dashboard/page.tsx`
```tsx
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
      {/* Dashboard content */}
    </div>
  );
}
```

Purpose: Server component that checks authentication status and renders protected content only for authenticated users. Includes logout functionality.

#### `src/app/auth/confirm/route.ts`
```typescript
import { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  // Parse URL params for token and verification type
  // ...
  
  const supabase = await createClient();
  
  // Handle email confirmation via code or OTP verification
  // ...

  // Redirect on success or error
  // ...
}
```

Purpose: API route handler that processes email verification tokens from confirmation emails and establishes user sessions.

#### `src/app/auth/verify-email/page.tsx`
```tsx
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px", textAlign: "center" }}>
      <h1>Check Your Email</h1>
      <div>
        {/* Verification instructions */}
        {/* ... */}
      </div>
      <div>
        <Link href="/login">Back to Login</Link>
      </div>
    </div>
  );
}
```

Purpose: Displays instructions to users after sign-up, prompting them to check their email for verification.

### Middleware

#### `src/middleware.ts`
```typescript
import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

Purpose: Entry point for Next.js middleware that updates auth sessions and handles route protection.

## Authentication Flow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────────┐
│  User Loads │     │ Middleware  │     │ Protected Resources │
│   Website   │────▶│ Updates Auth│────▶│ Require Auth Check  │
└─────────────┘     │   Session   │     └─────────────────────┘
                    └─────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────────────┐
│  User Fills │     │  Server     │     │ Email Verification  │
│ Signup Form │────▶│  Action     │────▶│     Required        │
└─────────────┘     │ Creates User│     └─────────────────────┘
                    └─────────────┘                │
                                                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────────────┐
│User Confirms│     │/auth/confirm│     │   Dashboard Page    │
│   Email     │────▶│   Route     │────▶│ (Protected Content) │
└─────────────┘     │Verifies Auth│     └─────────────────────┘
                    └─────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────────────┐
│  User Fills │     │  Server     │     │   Dashboard Page    │
│ Login Form  │────▶│  Action     │────▶│ (Protected Content) │
└─────────────┘     │Authenticates│     └─────────────────────┘
                    └─────────────┘                │
                                                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────────────┐
│ User Clicks │     │  Server     │     │      Login Page     │
│   Logout    │────▶│  Action     │────▶│  (Session Terminated)│
└─────────────┘     │Signs Out User│    └─────────────────────┘
                    └─────────────┘
```
