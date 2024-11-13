"use client";

import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import { AppSidebar } from "@/components/app-sidebar";

const DashboardWrapper = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>("default");
  const [tablesToDisplay, setTablesToDisplay] = useState<
    Array<{ tableNumber: number; seats: number }>
  >([]);

  const handleSelectLocation = (location: string) => {
    setSelectedLocation(location);
    // Simulate setting tablesToDisplay based on location, or leave as empty if none exist
    setTablesToDisplay([]); // Example empty array, adjust as needed
  };

  return (
    <div className="flex">
      <AppSidebar onSelectLocation={handleSelectLocation} />
      <main className="flex-grow">
        <Dashboard selectedLocation={selectedLocation} tablesToDisplay={tablesToDisplay} />
      </main>
    </div>
  );
};

export default DashboardWrapper;
