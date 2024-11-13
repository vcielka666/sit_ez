import React from "react";

type DashboardProps = {
  selectedLocation: string;
  tablesToDisplay?: Array<{ tableNumber: number; seats: number }>;
};

const Dashboard: React.FC<DashboardProps> = ({ selectedLocation, tablesToDisplay }) => {
  return (
    <main className="flex h-full items-center justify-center flex-col gap-4">
      <h1 className="text-2xl font-semibold">Dashboard for {selectedLocation}</h1>

      {tablesToDisplay && tablesToDisplay.length > 0 ? (
        <div>
          {tablesToDisplay.map((table) => (
            <div key={table.tableNumber} className="p-4 border rounded mb-2">
              <h2>Table {table.tableNumber}</h2>
              <p>Seats: {table.seats}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Tables and seats are not added yet!</p>
      )}
    </main>
  );
};

export default Dashboard;
