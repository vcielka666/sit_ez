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
    <div className="w-full h-auto relative flex justify-center items-center flex-col">
      <Label className=""> Login to your admin dashboard or{" "}
        <Link className="text-[green] flex align-center m-4 justify-center" href="/signin">
        create a new admin account<FiArrowRight />
          
        </Link></Label>
      
      <Button
        type="button"
        onClick={() => login("google")}
        className="mt-4"
      >
        <FaGoogle />
        Sign in with Google
      </Button>
    </div>
  );
};

export default LoginGoogle;
