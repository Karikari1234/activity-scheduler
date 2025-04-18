# User Profile Management

This document outlines the implementation of basic user profile management for the Activity Scheduler application, which was developed as part of Ticket 1.4.

## Overview

The profile management system allows users to:
- View and edit their registered email address
- Set and update their name, phone number, and designation
- Access a logout button from the profile page

## Database Setup

The feature requires a `profiles` table in your Supabase database. You can create this table by executing the SQL code provided in the `src/app/profile/profiles-table-setup.sql` file.

Key aspects of the database setup:
1. **Table Structure**: The `profiles` table has columns for name, phone_number, designation, and updated_at.
2. **Foreign Key Relationship**: The primary key (id) references auth.users, creating a one-to-one relationship.
3. **Row Level Security**: Policies ensure users can only access and modify their own profile data.
4. **Optional Trigger**: A database trigger automatically creates a profile entry when a new user signs up.

## Feature Implementation

### Pages and Components

1. **Profile Page** (`src/app/profile/page.tsx`):
   - Displays the user's current profile information
   - Provides forms for updating email and profile details
   - Includes the logout button
   - Shows success messages when updates are made

2. **Server Actions** (`src/app/profile/actions.ts`):
   - `updateProfile`: Updates name, phone number, and designation
   - `updateEmail`: Handles email address changes (requires verification)

3. **Navigation**: A link to the profile page is added to the main navigation for authenticated users.

### Authentication Flow

1. Email updates trigger Supabase's email verification flow:
   - User submits a new email address
   - Verification emails are sent
   - User confirms the change by clicking the link in the email

2. Profile updates are protected by Row Level Security:
   - Only authenticated users can access the profile page
   - Users can only view and edit their own profile

## Testing and Verification

To test the profile management feature:

1. **Setup Database**:
   - Execute the SQL in `profiles-table-setup.sql` in your Supabase SQL Editor
   - Verify the table was created correctly

2. **Test Profile Page Access**:
   - Login with a valid user
   - Navigate to the profile page from the navigation menu
   - Verify that the profile form loads correctly

3. **Test Profile Updates**:
   - Change profile information (name, phone, designation)
   - Submit the form and verify the success message
   - Reload the page and verify the changes persist

4. **Test Email Updates**:
   - Enter a new email address
   - Submit the form and verify the verification message
   - Check the email inbox for the verification link
   - Click the link and verify the email is updated

5. **Test Logout**:
   - Click the logout button on the profile page
   - Verify you are redirected to the login page
   - Verify you cannot access protected routes

## Known Limitations

1. No client-side form validation (could be added in future updates)
2. No password change functionality (could be added in future updates)
3. No profile picture upload capability (could be added in future updates)
