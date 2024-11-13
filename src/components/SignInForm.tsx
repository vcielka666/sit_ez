"use client";

import React from "react";
import AuthButton from "./AuthButton";
import { FiArrowRight } from "react-icons/fi";
import { Label } from "./ui/label";
import { loginWithCreds } from "../../actions/auth";

const SignInForm = () => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const result = await loginWithCreds(formData);

    if (result?.error) {
      // Handle the error, e.g., display a message
      console.error(result.error);
    } else {
      // Successfully signed in
      console.log("Successfully signed in");
    }
  };

  return (
    <div className="max-w-max mt-4 flex align-center justify-center">
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <Label className="text-lg flex justify-center items-center">
          Login to your
          admin  dashboard
            <FiArrowRight />
         
        </Label>
        <div>
          <label className="block mt-2 text-sm font-medium text-gray-200">Email</label>
          <input
            type="email"
            placeholder="Email"
            id="email"
            name="email"
            className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-200"
          />
        </div>
        <div>
          <label className="block mt-2 text-sm font-medium text-gray-200">Password</label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            id="password"
            className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-200"
          />
        </div>
        <div className="mt-4">
          <AuthButton />
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
