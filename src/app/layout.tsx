import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";



export const metadata: Metadata = {
  title: "SitEz",
  icons: {
    icon: "/favicon.ico",
  },
  description: "Watchdog app for your free seats, tables and reservations in your favourite places",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <SidebarProvider>
          <main>
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
