import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="max-w-narrow mx-auto my-xl p-lg text-center">
      <h1 className="text-heading font-bold mb-lg text-text-primary">Check Your Email</h1>
      <div className="bg-surface p-lg rounded-md mb-xl border border-divider">
        <p className="mb-md text-text-primary">
          We&apos;ve sent a verification link to your email address.
          Please check your inbox and click the link to complete your registration.
        </p>
        <p className="mb-md text-text-primary">
          After verification, you&apos;ll be redirected to your dashboard.
        </p>
        <p className="text-sm text-text-secondary">
          Note: The email might take a few minutes to arrive. Please also check your spam folder.
        </p>
      </div>
      <div>
        <Link href="/login" className="btn-primary inline-block">
          Back to Login
        </Link>
      </div>
    </div>
  );
}