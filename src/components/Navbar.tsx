import React from "react";
import { auth } from "../../auth";
import Image from "next/image";

const Navbar = async () => {
  const session = await auth();

  return (
    <>
      {session ? (
        <nav className="border-b bg-background w-full flex justify-center items-center">
          <div className="flex flex-shrink m-2">
            <p className="m-1">
              <span className="font-bold">Admin:</span> {session?.user?.name} {session?.user?.email}
            </p>
            <p className="m-1">
              {session?.user?.image && (
                <Image
                  className="rounded-full"
                  width={30}
                  height={30}
                  alt="User Avatar"
                  src={session.user.image}
                />
              )}
            </p>
          </div>
        </nav>
      ) : (
        ""
      )}
    </>
  );
};

export default Navbar;
