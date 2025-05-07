import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "react-day-picker/dist/style.css";
import Link from "next/link"; 
import { createClient } from "@/utils/supabase/server";
import LogoutButton from "./components/LogoutButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Activity Scheduler",
  description: "Your daily scheduling application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;
  
  return (
    <html lang="en">
      <body className={`${inter.variable} font-primary bg-background text-text-primary antialiased`}>
        <header className="border-b border-divider">
          <div className="container mx-auto flex h-16 items-center px-4">
            <Link href="/" className="text-xl font-bold text-primary mr-6">
              Activity Scheduler
            </Link>
            <nav className="flex gap-6">
              <Link href="/" className="text-sm font-medium hover:text-primary">
                Home
              </Link>
              
              {/* Show these links when user is authenticated */}
              {user && (
                <>
                  <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
                    Dashboard
                  </Link>
                  <Link href="/schedules" className="text-sm font-medium hover:text-primary">
                    Schedules
                  </Link>
                  <Link href="/schedules/new" className="text-sm font-medium hover:text-primary">
                    New Schedule
                  </Link>
                </>
              )}
            </nav>
            
            <div className="ml-auto flex items-center gap-4">
              {/* Show these links when user is NOT authenticated */}
              {!user && (
                <>
                  <Link href="/login" className="text-sm font-medium hover:text-primary">
                    Login
                  </Link>
                  <Link href="/signup" className="text-sm font-medium hover:text-primary">
                    Sign Up
                  </Link>
                </>
              )}
              
              {/* Show these links when user IS authenticated */}
              {user && (
                <>
                  <Link href="/profile" className="text-sm font-medium hover:text-primary">
                    Profile
                  </Link>
                  <LogoutButton />
                </>
              )}
            </div>
          </div>
        </header>
        <main className="container mx-auto py-6 px-4">{children}</main>
      </body>
    </html>
  );
}