"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

const Logout = () => {
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="p-4">
      <Button className="w-full p-6" onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default Logout;
