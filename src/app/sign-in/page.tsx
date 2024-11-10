"use client";

import { signIn } from "next-auth/react"; // Import signIn from next-auth/react

const SignIn = () => {
  return (
    <div>
      <button type="button" onClick={() => signIn("google", { callbackUrl: "/adminDashboard" })}>
        Sign in with Google
      </button>
    </div>
  );
};

export default SignIn;
