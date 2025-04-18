# Activity Scheduler Documentation

## Authentication System Documentation

This directory contains documentation for the authentication system implemented in the Activity Scheduler application.

### Ticket Implementation

- [Ticket 1.1: Authentication Implementation](./Ticket-1.1-Auth-Implementation.md) - Detailed documentation of the authentication implementation for Ticket 1.1

### Technical Documentation

- [Authentication Code Structure](./Authentication-Code-Structure.md) - Detailed overview of the authentication code structure and flow
- [Authentication Quick Start Guide](./Authentication-Quick-Start.md) - Quick start guide for developers working with the authentication system
- [Authentication Testing Guide](./Authentication-Testing-Guide.md) - Guide for testing the authentication system
- [Styling Guide](./Styling-Guide.md) - Comprehensive guide to the application's styling system based on Tailwind CSS v4

## Project Overview

The Activity Scheduler is a Next.js 15 application with the following core technologies:

- **Frontend**: Next.js 15 with App Router
- **Authentication**: Supabase Auth
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom configuration

## Getting Started

1. Clone the repository
2. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Run the development server:
   ```
   npm run dev
   ```

## Project Structure

```
src/
├── app/
│   ├── auth/         # Email verification and confirmation
│   ├── dashboard/    # Protected dashboard page
│   ├── login/        # Login page and server actions
│   ├── signup/       # Signup page and server actions
│   ├── globals.css   # Global styles including Tailwind imports
│   └── layout.tsx    # Root layout
├── middleware.ts     # Auth middleware
└── utils/
    └── supabase/     # Supabase client utilities
```

## Development Guidelines

1. **Server Components**: Use React Server Components for pages that require server-side data fetching or authentication
2. **Server Actions**: Use server actions for form submissions and data modifications
3. **Authentication**: Always use the provided Supabase client utilities for authentication
4. **Route Protection**: Ensure all protected routes check for authentication
5. **Error Handling**: Implement proper error handling for all authentication operations
6. **Styling**: Follow the Tailwind CSS conventions defined in the Styling Guide for consistent UI

## Styling System

The application uses Tailwind CSS v4 with a custom configuration that matches the UI Design System. Key aspects include:

- Custom color palette based on the Todoist-inspired design system
- Consistent spacing, typography, and component styles
- Support for light and dark themes
- Responsive design with mobile, tablet, and desktop breakpoints

For full details, see the [Styling Guide](./Styling-Guide.md).

## Future Enhancements

1. Add social login providers
2. Implement password reset functionality
3. Add user profile management
4. Enhance error messaging
5. Improve form validation
6. Add remember me functionality
7. Implement multi-factor authentication
