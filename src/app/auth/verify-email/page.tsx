import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px", textAlign: "center" }}>
      <h1>Check Your Email</h1>
      <div style={{ 
        padding: "20px", 
        backgroundColor: "#f0f9ff", 
        border: "1px solid #bae6fd",
        borderRadius: "8px",
        marginBottom: "20px"
      }}>
        <p style={{ marginBottom: "15px" }}>
          We&apos;ve sent a verification link to your email address.
          Please check your inbox and click the link to complete your registration.
        </p>
        <p style={{ marginBottom: "15px" }}>
          After verification, you&apos;ll be redirected to your dashboard.
        </p>
        <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
          Note: The email might take a few minutes to arrive. Please also check your spam folder.
        </p>
      </div>
      <div>
        <Link 
          href="/login" 
          style={{ 
            display: "inline-block",
            padding: "10px 15px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            textDecoration: "none",
            marginRight: "10px"
          }}
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}