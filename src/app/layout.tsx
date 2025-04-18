import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link"; // Import Link

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daily Scheduler",
  description: "Your daily scheduling application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav style={{ padding: '1rem', borderBottom: '1px solid #eee', marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
           {/* We will conditionally show these later based on auth state */}
          <Link href="/">Home</Link>
          <Link href="/login">Login</Link>
          <Link href="/signup">Sign Up</Link>
          <Link href="/dashboard">Dashboard</Link> {/* Link to dashboard */}
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}