import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";

import { auth } from "../../../auth";
import Navbar from "@/components/Navbar";
import SignIn from "../sign-in/page";
import SignUpForm from "@/components/SignInForm";

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin interface for managing places and tables",
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      {session ? (
        <SidebarProvider>
          <div className="flex wrap justify-center items-center w-full min-w-[320px]">
          <SidebarTrigger />
          <Navbar />
          </div>
          <main className="w-full h-full">
          
            {children}</main>
        </SidebarProvider>
      ) : (
        <div className="flex justify-center items-center flex-col m-2 w-full">
          <SignUpForm />
          <SignIn />
        </div>
      )}
    </SessionProvider>
  );
}
