"use client";

import { Button } from "./ui/button";
import { logout } from "../../actions/auth";

const Logout = () => {
  
  return (
    <div className="p-4">
      <Button className="w-full p-6" onClick={logout}>Logout</Button>
    </div>
  );
};

export default Logout;
