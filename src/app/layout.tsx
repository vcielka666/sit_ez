import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import { auth } from "../../auth";
import Navbar from "@/components/Navbar";



export const metadata: Metadata = {
  title: "SitEz",
  description: "Watchdog app for your free seats, tables and reservations in your favourite places",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
    <html lang="en">
      <body >
      <Navbar />
        <SidebarProvider>
          <main className="w-full h-full">
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
    </SessionProvider>
  );
}
