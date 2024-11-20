"use client";

import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import { AppSidebar } from "@/components/app-sidebar";

type SeatData = {
  seatNumber: number;
};

type TableData = {
  id: string;
  tableNumber: number;
  seats: SeatData[];
};

const DashboardWrapper = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>("default");
  const [tablesToDisplay, setTablesToDisplay] = useState<TableData[]>([]);

  const handleSelectLocation = (location: string) => {
    setSelectedLocation(location);

    // Simulate fetching tables for the selected location
    setTablesToDisplay([]); // Update this with actual fetched data
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
