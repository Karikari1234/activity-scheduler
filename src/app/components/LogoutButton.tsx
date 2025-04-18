"use client";

import { signOut } from "../auth/actions";

export default function LogoutButton() {
  return (
    <form>
      <button 
        formAction={signOut}
        className="text-primary hover:underline font-medium"
      >
        Logout
      </button>
    </form>
  );
}
