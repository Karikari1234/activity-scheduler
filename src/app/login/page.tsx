import { login } from "./actions";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h1>Log In</h1>
      <form>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email">Email:</label>
          <input id="email" name="email" type="email" required style={{ display: "block", width: "100%", padding: "8px", marginTop: "5px" }} />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="password">Password:</label>
          <input id="password" name="password" type="password" required style={{ display: "block", width: "100%", padding: "8px", marginTop: "5px" }} />
        </div>
        <button 
          formAction={login}
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
          Log in
        </button>
      </form>
      <p style={{ marginTop: "20px", textAlign: "center" }}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" style={{ color: "#0070f3", textDecoration: "none" }}>
          Sign up
        </Link>
      </p>
    </div>
  );
}