import { signup } from "./actions";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="max-w-narrow mx-auto my-xl p-lg">
      <h1 className="text-heading font-bold mb-lg text-text-primary">Sign Up</h1>
      <form className="flex flex-col gap-md">
        <div className="flex flex-col">
          <label htmlFor="email" className="text-text-primary font-medium mb-xs">Email:</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            required 
            className="input-text w-full" 
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-text-primary font-medium mb-xs">Password:</label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            required 
            minLength={6}
            className="input-text w-full" 
          />
          <p className="text-xs text-text-secondary mt-xs">Password must be at least 6 characters</p>
        </div>
        <button 
          formAction={signup}
          className="btn-primary w-full mt-md"
        >
          Sign up
        </button>
      </form>
      <div className="text-center mt-lg">
        <p className="text-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}