"use client";

import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react"; // Import signIn from next-auth/react
import { Button } from "@/components/ui/button";
import { Label } from "./ui/label";
import  Link  from "next/link"
import { login } from "../../actions/auth";
import { FiArrowRight } from "react-icons/fi";

const LoginGoogle = () => {
  return (
    <div className="w-full h-auto flex justify-center items-center flex-col">
   <p className="m-2">or</p>
      
      <Button
        type="button"
        onClick={() => login("google")}
        className="mt-4 w-full"
      >
        <FaGoogle />
        Sign in with Google
      </Button>
    </div>
  );
};

export default LoginGoogle;
