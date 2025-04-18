import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-lg">
      <div className="text-center max-w-narrow mx-auto">
        <h1 className="text-large-heading font-bold text-primary mb-md">404</h1>
        <h2 className="text-heading font-semibold mb-md text-text-primary">Page Not Found</h2>
        <p className="text-subtitle text-text-secondary mb-xl">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Return to Home
        </Link>
      </div>
    </div>
  );
}