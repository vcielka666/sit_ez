import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import QueryProvider from "@/components/QueryProvider"; 

export const metadata: Metadata = {
  title: "SitEz",
  description: "Discover free seats and tables in your favorite places",
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
      <Script
  src={`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  )}&libraries=places`}
  strategy="beforeInteractive"
  async
  defer
/>


      </head>
      <body>
        <QueryProvider>
          <main className="w-full h-full">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
