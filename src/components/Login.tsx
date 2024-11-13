"use client";

import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { login } from "../../actions/auth";


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
