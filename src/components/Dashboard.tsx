import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";

type SeatData = {
  seatNumber: number;
};

type TableData = {
  id: string;
  tableNumber: number;
  seats: SeatData[];
  totalSeats?: number; // Add optional `totalSeats` for the new logic
  freeSeats?: number;  // Add optional `freeSeats` for the new logic
};

type Place = {
  id: string;
  name: string;
};

type TableResponse = {
  id: string;
  tableNumber: number;
  seats: SeatData[];
  totalSeats: number; // Ensure this is included in API responses
  freeSeats: number;  // Ensure this is included in API responses
};

type DashboardProps = {
  selectedLocation: string;
  tablesToDisplay?: TableData[];
};

const Dashboard: React.FC<DashboardProps> = ({ selectedLocation, tablesToDisplay = [] }) => {
  const [seatsNumber, setSeatsNumber] = useState(0);
  const [tables, setTables] = useState(1);
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [tablesData, setTablesData] = useState<TableData[]>(tablesToDisplay);

// Fetch tables and seats for the selected location
useEffect(() => {
  const fetchTablesAndSeats = async () => {
    if (!selectedLocation || selectedLocation === "default") return;

    try {
      const placeResponse = await fetch("/api/getPlace");
      if (!placeResponse.ok) {
        throw new Error(`Failed to fetch places. Status: ${placeResponse.status}`);
      }

      const places = await placeResponse.json();
      const selectedPlace = places.find((place: Place) => place.name === selectedLocation);

      if (!selectedPlace) {
        setTablesData([]);
        return;
      }

      setPlaceId(selectedPlace.id);

      const tablesResponse = await fetch(`/api/getTables?placeId=${selectedPlace.id}`);
      if (!tablesResponse.ok) {
        throw new Error(`Failed to fetch tables. Status: ${tablesResponse.status}`);
      }

      const tables = await tablesResponse.json();

      // Validate that the response is an array
      if (!Array.isArray(tables)) {
        throw new Error("API response is not an array");
      }

      setTablesData(
        tables.map((table) => ({
          ...table,
          totalSeats: table.totalSeats || 0, // Ensure totalSeats is a number
          freeSeats: table.freeSeats || 0,   // Ensure freeSeats is a number
        }))
      );
    } catch (error: any) {
      console.error("Error fetching tables and seats:", error.message || error);
      setTablesData([]); // Clear tables on error
    }
  };

  fetchTablesAndSeats();
}, [selectedLocation]);

  // Add a seat to a specific table
  const handleAddSeats = async (tableId: string) => {
    try {
      const response = await fetch("/api/addSeats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableId }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error);
        return;
      }

      const updatedTable = await response.json();
      setTablesData((prevTables) =>
        prevTables.map((table) =>
          table.id === tableId ? { ...table, freeSeats: updatedTable.freeSeats } : table
        )
      );
    } catch (error) {
      console.error("Error adding seat:", error);
    }
  };

  // Delete a seat from a specific table
  const handleDeleteSeats = async (tableId: string) => {
    try {
      const response = await fetch("/api/deleteSeats", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableId }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error);
        return;
      }

      const updatedTable = await response.json();
      setTablesData((prevTables) =>
        prevTables.map((table) =>
          table.id === tableId ? { ...table, freeSeats: updatedTable.freeSeats } : table
        )
      );
    } catch (error) {
      console.error("Error deleting seat:", error);
    }
  };

  // Add a table with the specified number of seats
  const addTablesToDatabase = async () => {
    if (!placeId) {
      console.error("No placeId found. Unable to add tables.");
      return;
    }

    try {
      const response = await fetch("/api/addTable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId,
          tableCount: tables,
          seatsPerTable: seatsNumber,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add tables. Status: ${response.status}`);
      }

      const newTables: TableResponse[] = await response.json();
      setTablesData((prevTables) => [
        ...prevTables,
        ...newTables.map((table) => ({
          ...table,
          totalSeats: table.totalSeats,
          freeSeats: table.freeSeats,
        })),
      ]);
    } catch (error) {
      console.error("Error adding tables:", error);
    }
  };

  // Delete a specific table
  const handleDeleteTable = async (tableId: string) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this table?");
    if (!isConfirmed) return;

    try {
      const response = await fetch("/api/deleteTable", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete table. Status: ${response.status}`);
      }

      setTablesData((prevTables) => prevTables.filter((table) => table.id !== tableId));
    } catch (error) {
      console.error("Error deleting table:", error);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col gap-4">
      <div className="w-full max-w-[350px] border border-black flex flex-col justify-center gap-2 p-2 rounded-md">
        <h1 className="text-center font-bold text-xl">Add table and seats</h1>
        <p className="flex justify-between items-center">
          <span className="font-bold text-2xl">{tables}</span>table<span className="text-xs">with</span>{" "}
          <span className="font-bold text-2xl">{seatsNumber}</span>seats
        </p>
        <div className="flex gap-4 justify-between">
          <div className="flex flex-col justify-center w-min">
            <Button className="bg-green-800 hover:bg-green-900" onClick={() => setTables(tables + 1)}>
              + table
            </Button>
            <Button className="bg-red-800 hover:bg-red-900" onClick={() => setTables(tables > 1 ? tables - 1 : 1)}>
              - table
            </Button>
          </div>
          <div className="flex flex-col justify-center w-min">
            <Button className="bg-green-800 hover:bg-green-900" onClick={() => setSeatsNumber(seatsNumber + 1)}>
              + seat
            </Button>
            <Button
              className="bg-red-800 hover:bg-red-900"
              onClick={() => setSeatsNumber(seatsNumber > 0 ? seatsNumber - 1 : 0)}
            >
              - seat
            </Button>
          </div>
        </div>
        <Button onClick={addTablesToDatabase} className="mt-4 bg-blue-600 hover:bg-blue-700">
          Add table
        </Button>
      </div>

      <main className="flex h-full items-center justify-center flex-col gap-4">
  <h1 className="text-2xl font-semibold">Dashboard for {selectedLocation}</h1>

  {tablesData.length > 0 ? (
    <div className="flex gap-2 flex-wrap justify-center">
      {tablesData.map((table) => {
        // Determine border color based on the free seats
        const borderColor =
          table.freeSeats === table.totalSeats
            ? "border-green-500" // All seats free
            : table.freeSeats === 0
            ? "border-red-500" // No free seats
            : "border-orange-500"; // Some seats are free

        const fullyOcuppied = table.freeSeats === 0;
        const fullyFree = table.freeSeats === table.totalSeats;
        return (
          <div
            key={table.id}
            className={`p-4 block border ${borderColor} rounded mb-2 relative`}
          >
            {/* Delete button styled as an "X" in the corner */}
            <Button
              className="bg-red-600 hover:bg-red-700 w-fit h-fit rounded p-1 absolute top-0 right-0"
              onClick={() => handleDeleteTable(table.id)}
            >
              X
            </Button>
            <h2 className="mt-3">
              Table {table.tableNumber} with <span>{table.totalSeats} seats.</span>
            </h2>
            <p className="mb-4">Free Seats: {table.freeSeats}</p>
            <div className="flex gap-2 flex-col">
              <div className="flex gap-2">
                <Button
                  className="bg-green-800 hover:bg-green-900"
                  onClick={() => handleAddSeats(table.id)}
                >
                  + seat
                </Button>
                <Button
                  className="bg-red-800 hover:bg-red-900"
                  onClick={() => handleDeleteSeats(table.id)}
                >
                  - seat
                </Button>
              </div>
              {fullyOcuppied && <p className="text-red-700 text-xs">This table is fully occupied</p>}
              {fullyFree && <p className="text-green-700 text-xs">This table is completely FREE </p>}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <p className="text-gray-500">Tables and seats are not added yet!</p>
  )}
</main>


    </div>
  );
};

export default Dashboard;
