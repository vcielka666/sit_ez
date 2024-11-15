import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";

type DashboardProps = {
  selectedLocation: string;
  tablesToDisplay?: Array<{ tableNumber: number; seats: number }>;
};

const Dashboard: React.FC<DashboardProps> = ({ selectedLocation, tablesToDisplay }) => {
  const [seatsNumber, setSeatsNumber] = useState(0);
  const [tables, setTables] = useState(1);
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [tablesData, setTablesData] = useState<Array<{ tableNumber: number; seats: number }>>([]);

  useEffect(() => {
    // Fetch the placeId when a location is selected
    const fetchPlaceId = async () => {
      try {
        const response = await fetch("/api/getPlace");
        const data = await response.json();

        // Find the place that matches the selected location and get its ID
        const selectedPlace = data.find((place: any) => place.name === selectedLocation);
        if (selectedPlace) {
          setPlaceId(selectedPlace.id);
          setTablesData(selectedPlace.tables || []); // Initialize tables if available
        }
      } catch (error) {
        console.error("Error fetching place:", error);
      }
    };

    fetchPlaceId();
  }, [selectedLocation]);

  const handleAddSeats = () => setSeatsNumber(seatsNumber + 1);
  const handleDeleteSeats = () => setSeatsNumber(seatsNumber > 0 ? seatsNumber - 1 : 0);
  const handleAddTable = () => setTables(tables + 1);
  const handleDeleteTable = () => setTables(tables > 1 ? tables - 1 : 1);

  const addTablesToDatabase = async () => {
    if (!placeId) {
      console.error("No placeId found. Unable to add tables.");
      return;
    }

    try {
      const response = await fetch("/api/addTable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          placeId,
          tableCount: tables,
          seatsPerTable: seatsNumber,
        }),
      });

      if (response.ok) {
        const newTables = await response.json();
        setTablesData(newTables); // Update local state with new tables data
        console.log("Tables added successfully");
      } else {
        console.error("Failed to add tables");
      }
    } catch (error) {
      console.error("Error adding tables:", error);
    }
  };

  return (
    <div>
      <div className="border border-black flex flex-col justify-center gap-4 w-fit p-2 rounded-md">
        <h1 className="text-center font-bold text-xl">Add table and seats</h1>
        <p><span className="font-bold text-2xl">{tables}</span> table with <span className="font-bold text-2xl">{seatsNumber}</span> seats</p>
        <div className="flex gap-4 justify-between">
          <div className="flex flex-col justify-center w-min">
            <Button className="bg-green-800 hover:bg-green-900" onClick={handleAddTable}>+ table</Button>
            <Button className="bg-red-800 hover:bg-red-900" onClick={handleDeleteTable}>- table</Button>
          </div>
          <div className="flex flex-col justify-center w-min">
            <Button className="bg-green-800 hover:bg-green-900" onClick={handleAddSeats}>+ seat</Button>
            <Button className="bg-red-800 hover:bg-red-900" onClick={handleDeleteSeats}>- seat</Button>
          </div>
        </div>
        <Button onClick={addTablesToDatabase} className="mt-4 bg-blue-600 hover:bg-blue-700">Add table</Button>
      </div>

      <main className="flex h-full items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-semibold">Dashboard for {selectedLocation}</h1>

        {tablesData.length > 0 ? (
          <div>
            {tablesData.map((table, index) => (
              <div key={index} className="p-4 border rounded mb-2">
                <h2>Table {index + 1}</h2>
                <p>Seats: {table.seats}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Tables and seats are not added yet!</p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
