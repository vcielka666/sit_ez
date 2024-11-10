"use client"; // Make this a client component

import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import { AppSidebar } from "@/components/app-sidebar";
import Page from "@/app/logout/page";

const DashboardWrapper = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>("default");

  const handleSelectLocation = (location: string) => {
    setSelectedLocation(location);
  };

  return (
    <div className="flex">
      <AppSidebar onSelectLocation={handleSelectLocation} />
      <main className="flex-grow">
        <Dashboard selectedLocation={selectedLocation} />
        
      </main>
    </div>
  );
};

export default DashboardWrapper;
