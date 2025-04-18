import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
        <nav className="p-md border-b border-divider mb-md flex gap-md">
          <Link href="/" className="text-primary hover:underline font-medium">Home</Link>
          
          {/* Show these links when user is NOT authenticated */}
          {!user && (
            <>
              <Link href="/login" className="text-primary hover:underline font-medium">Login</Link>
              <Link href="/signup" className="text-primary hover:underline font-medium">Sign Up</Link>
            </>
          )}
          
          {/* Show these links when user IS authenticated */}
          {user && (
            <>
              <Link href="/dashboard" className="text-primary hover:underline font-medium">Dashboard</Link>
              <Link href="/profile" className="text-primary hover:underline font-medium">Profile</Link>
              <div className="ml-auto">
                <LogoutButton />
              </div>
            </>
          )}
        </nav>
        <main className="container mx-auto px-md">{children}</main>
      </body>
    </html>
  );
}