# Authentication Quick Start Guide

This guide provides a quick overview of the authentication system implemented in the Activity Scheduler application for developers who need to work with or extend the current functionality.

## Technology Stack

- **Next.js 15** with App Router
- **Supabase Auth** as the authentication provider
- **TypeScript** for type safety
- **@supabase/ssr** library for server-side rendering with Supabase

## Core Authentication Components

### 1. Supabase Client Initialization

The application uses two types of Supabase clients:

**Server-side client** (`src/utils/supabase/server.ts`):
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { /* cookie handlers */ },
    }
  );
}
```

**Client-side client** (`src/utils/supabase/client.ts`):
```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### 2. Authentication Server Actions

**Sign Up** (`src/app/signup/actions.ts`):
```typescript
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

**Login** (`src/app/login/actions.ts`):
```typescript
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

### 3. Route Protection

**Middleware** (`src/middleware.ts` & `src/utils/supabase/middleware.ts`):
- Intercepts all requests
- Updates auth session cookies
- Redirects unauthenticated users from protected routes to login

**Server-side protection** (`src/app/dashboard/page.tsx`):
```typescript
export default async function PrivatePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  return <p>Hello {data.user.email}</p>;
}
```

### 4. Email Verification

- `/auth/confirm/route.ts`: API route that processes verification tokens
- `/auth/verify-email/page.tsx`: Page shown to users after signup with instructions

## Authentication Flow

1. **Sign-up**: 
   - User signs up → Account created in Supabase
   - Verification email sent → User shown verification instructions page

2. **Email verification**:
   - User clicks verification link → Token processed
   - Session established → User redirected to dashboard

3. **Login**:
   - User logs in → Credentials verified
   - Session established → User redirected to dashboard

4. **Route protection**:
   - User tries to access protected route
   - Middleware/server checks for valid session
   - If no valid session → Redirect to login

## How to Use

### Implementing a Protected Route

```typescript
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data?.user) {
    redirect("/login");
  }
  
  // Render protected content...
  return <div>Protected content for {data.user.email}</div>;
}
```

### Adding Auth-Related Data

```typescript
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch user-specific data if user exists
  let userData = null;
  if (user) {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    userData = data;
  }
  
  // Use user data in the component...
}
```

### Sign Out Functionality

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
```

## Environment Setup

Required environment variables in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=your-site-url (or http://localhost:3000 for development)
```

## Common Authentication Tasks

### Get Current User

```typescript
// Server-side
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

// Client-side 
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const supabase = createClient();
    
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    
    getUser();
  }, []);
  
  return { user, loading };
}
```

### Check if User is Authenticated

```typescript
// Server component
const { data, error } = await supabase.auth.getUser();
const isAuthenticated = !error && data?.user;

// Client component
const { user, loading } = useUser();
const isAuthenticated = !loading && user;
```

## Common Issues and Solutions

1. **Sessions not persisting**:
   - Ensure middleware.ts is properly updating sessions
   - Check that cookie handling is working correctly

2. **Redirect loops**:
   - Make sure route protection logic is consistent
   - Check for conflicts between middleware and page-level auth checks

3. **Email verification issues**:
   - Verify email templates in Supabase dashboard
   - Check that redirect URLs match your application URLs

4. **CORS errors with Supabase**:
   - Ensure your site URL is added to the allowed URLs in Supabase dashboard
   - Check for mixed HTTP/HTTPS issues

## Extending the Authentication System

### Adding Social Login

Update your sign-in action:

```typescript
export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    }
  });
  
  if (error) {
    redirect("/error");
  }
  
  return { data };
}
```

### Adding Password Reset

Create a password reset form and action:

```typescript
// actions.ts
export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
  });
  
  if (error) {
    redirect("/error");
  }
  
  redirect("/auth/check-email");
}
```

## Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [@supabase/ssr Documentation](https://supabase.com/docs/guides/auth/server-side/nextjs)
