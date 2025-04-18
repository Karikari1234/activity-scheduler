import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link"; 

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Activity Scheduler",
  description: "Your daily scheduling application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-primary bg-background text-text-primary antialiased`}>
        <nav className="p-md border-b border-divider mb-md flex gap-md">
           {/* We will conditionally show these later based on auth state */}
          <Link href="/" className="text-primary hover:underline font-medium">Home</Link>
          <Link href="/login" className="text-primary hover:underline font-medium">Login</Link>
          <Link href="/signup" className="text-primary hover:underline font-medium">Sign Up</Link>
          <Link href="/dashboard" className="text-primary hover:underline font-medium">Dashboard</Link>
        </nav>
        <main className="container mx-auto px-md">{children}</main>
      </body>
    </html>
  );
}