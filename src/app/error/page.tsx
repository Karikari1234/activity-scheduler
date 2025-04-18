"use client";

import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-lg">
      <div className="text-center max-w-narrow mx-auto">
        <h1 className="text-large-heading font-bold text-primary mb-md">Something went wrong</h1>
        <p className="text-subtitle text-text-secondary mb-xl">
          We&apos;re sorry, but there was an error processing your request.
        </p>
        <div className="flex flex-col sm:flex-row gap-md justify-center">
          <Link href="/" className="btn-primary">
            Return to Home
          </Link>
          <button onClick={() => window.location.reload()} className="btn-secondary">
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}