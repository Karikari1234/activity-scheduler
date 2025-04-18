# Authentication Testing Guide

This guide outlines steps to test the authentication system implemented for Ticket 1.1 in the Activity Scheduler application.

## Prerequisites

1. A local environment with Node.js installed
2. The project cloned and dependencies installed
3. Environment variables set up in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000 (for development)
   ```

## Test Cases

### 1. Sign-Up Flow

**Test Case 1.1: Successful Sign-Up**

Steps:
1. Navigate to `/signup`
2. Enter a valid email address and password (minimum 6 characters)
3. Click "Sign up" button
4. Verify redirect to `/auth/verify-email` page
5. Check test email inbox for verification email
6. Click the verification link in the email
7. Verify redirect to `/dashboard` after email confirmation

Expected Results:
- User account is created in Supabase Auth
- Verification email is sent
- After clicking verification link, user is redirected to dashboard
- Dashboard displays user's email address

**Test Case 1.2: Invalid Sign-Up (Existing Email)**

Steps:
1. Navigate to `/signup`
2. Enter an email that already exists in the system
3. Enter a password
4. Click "Sign up" button

Expected Results:
- Error occurs (should be redirected to error page)
- User is not created twice

**Test Case 1.3: Invalid Sign-Up (Password Too Short)**

Steps:
1. Navigate to `/signup`
2. Enter a valid email
3. Enter a password with fewer than 6 characters
4. Click "Sign up" button

Expected Results:
- Browser validation prevents form submission due to minLength attribute
- If browser validation is bypassed, Supabase will return an error

### 2. Login Flow

**Test Case 2.1: Successful Login**

Steps:
1. Navigate to `/login`
2. Enter valid credentials for an existing, verified user
3. Click "Log in" button

Expected Results:
- User is authenticated
- User is redirected to `/dashboard`
- Dashboard shows user's email address

**Test Case 2.2: Failed Login (Wrong Password)**

Steps:
1. Navigate to `/login`
2. Enter a valid email but incorrect password
3. Click "Log in" button

Expected Results:
- Authentication fails
- User is redirected to error page

**Test Case 2.3: Failed Login (Non-existent User)**

Steps:
1. Navigate to `/login`
2. Enter an email that doesn't exist in the system
3. Enter any password
4. Click "Log in" button

Expected Results:
- Authentication fails
- User is redirected to error page

### 3. Route Protection

**Test Case 3.1: Accessing Protected Route When Authenticated**

Steps:
1. Log in successfully
2. Navigate directly to `/dashboard`

Expected Results:
- Dashboard page loads successfully
- User's email is displayed

**Test Case 3.2: Accessing Protected Route When Not Authenticated**

Steps:
1. Clear cookies or use incognito window
2. Navigate directly to `/dashboard`

Expected Results:
- Middleware intercepts the request
- User is redirected to `/login`

**Test Case 3.3: Accessing Auth Pages When Already Authenticated**

Steps:
1. Log in successfully
2. Attempt to navigate to `/login` or `/signup`

Expected Results:
- Pages should load normally (current implementation doesn't redirect authenticated users away from auth pages)
- Future enhancement could redirect already authenticated users to dashboard

### 4. Email Verification

**Test Case 4.1: Email Verification Link Works**

Steps:
1. Sign up with a new email
2. Find verification email and click link
3. Observe redirect behavior

Expected Results:
- `/auth/confirm` route processes the token
- User session is established
- User is redirected to dashboard

**Test Case 4.2: Invalid Verification Token**

Steps:
1. Manipulate a verification link to have an invalid token
2. Access the manipulated link

Expected Results:
- Verification fails
- User is redirected to error page or login with error message

## Bug Reporting Template

If you encounter issues during testing, please report them using this template:

```
### Bug Description
[Brief description of the issue]

### Steps to Reproduce
1. 
2.
3.

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Environment
- Browser: [e.g., Chrome 102]
- OS: [e.g., macOS 12.4]
- Node version: [e.g., 18.12.1]
- Next.js version: 15.3.1

### Screenshots
[If applicable]

### Console Errors
[If applicable]
```

## Performance Considerations

The current authentication implementation is lightweight and should perform well for typical use cases. However, as the application scales, consider:

1. Adding more robust error handling with specific error messages
2. Implementing rate limiting for login attempts to prevent brute force attacks
3. Adding client-side form validation to improve user experience
4. Optimizing the middleware for performance as routes increase

## Security Notes

The current implementation includes several security best practices:

1. Uses Supabase Auth which implements secure password hashing
2. Email verification is required for new accounts
3. Protected routes are secured both by middleware and server-side checks
4. Environment variables are used for sensitive credentials

Future security enhancements could include:
1. Adding CSRF protection
2. Implementing password complexity requirements
3. Adding rate limiting
4. Adding captcha for registration/login
5. Implementing multi-factor authentication
