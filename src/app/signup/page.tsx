import { signup } from "./actions";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h1>Sign Up</h1>
      <form>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email">Email:</label>
          <input id="email" name="email" type="email" required style={{ display: "block", width: "100%", padding: "8px", marginTop: "5px" }} />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="password">Password:</label>
          <input id="password" name="password" type="password" required minLength={6} style={{ display: "block", width: "100%", padding: "8px", marginTop: "5px" }} />
        </div>
        <button 
          formAction={signup}
          style={{ 
            padding: "10px 15px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            width: "100%"
          }}
        >
          Sign up
        </button>
      </form>
      <p style={{ marginTop: "20px", textAlign: "center" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "#0070f3", textDecoration: "none" }}>
          Log in
        </Link>
      </p>
    </div>
  );
}