"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-lg">
      <div className="text-center max-w-narrow mx-auto">
        <h1 className="text-large-heading font-bold text-primary mb-md">Something went wrong</h1>
        <p className="text-subtitle text-text-secondary mb-lg">
          We&apos;re sorry, but there was an error processing your request.
        </p>
        <div className="p-md bg-surface rounded-md mb-xl text-sm text-text-secondary">
          <p>Error: {error.message || "Unknown error"}</p>
          {error.digest && <p className="mt-sm">Digest: {error.digest}</p>}
        </div>
        <div className="flex flex-col sm:flex-row gap-md justify-center">
          <button onClick={() => reset()} className="btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn-secondary">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}