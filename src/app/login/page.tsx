import { LoginForm } from "./LoginForm";



export default function LoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
    // <div className="max-w-narrow mx-auto my-xl p-lg">
    //   <h1 className="text-heading font-bold mb-lg text-text-primary">Log In</h1>
    //   <form className="flex flex-col gap-md">
    //     <div className="flex flex-col">
    //       <label htmlFor="email" className="text-text-primary font-medium mb-xs">Email:</label>
    //       <input
    //         id="email"
    //         name="email"
    //         type="email"
    //         required
    //         className="input-text w-full"
    //       />
    //     </div>
    //     <div className="flex flex-col">
    //       <label htmlFor="password" className="text-text-primary font-medium mb-xs">Password:</label>
    //       <input
    //         id="password"
    //         name="password"
    //         type="password"
    //         required
    //         className="input-text w-full"
    //       />
    //     </div>
    //     <button
    //       formAction={login}
    //       className="btn-primary w-full mt-md"
    //     >
    //       Log in
    //     </button>
    //   </form>
    //   <div className="text-center mt-lg">
    //     <p className="text-text-secondary">
    //       Don&apos;t have an account?{" "}
    //       <Link href="/signup" className="text-primary hover:underline font-medium">
    //         Sign up
    //       </Link>
    //     </p>
    //   </div>
    // </div>
  );
}