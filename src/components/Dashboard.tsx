import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";

type SeatData = {
  seatNumber: number;
};

type TableData = {
  id: string;
  tableNumber: number;
  seats: SeatData[];
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
        const selectedPlace = places.find((place: any) => place.name === selectedLocation);

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
        setTablesData(tables.map((table: any) => ({ ...table, seats: table.seats || [] })));
      } catch (error) {
        console.error("Error fetching tables and seats:", error);
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
        throw new Error(`Failed to add seat. Status: ${response.status}`);
      }

      const newSeat = await response.json();
      setTablesData((prevTables) =>
        prevTables.map((table) =>
          table.id === tableId ? { ...table, seats: [...table.seats, newSeat] } : table
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
        throw new Error(`Failed to delete seat. Status: ${response.status}`);
      }

      setTablesData((prevTables) =>
        prevTables.map((table) =>
          table.id === tableId && table.seats.length > 0
            ? { ...table, seats: table.seats.slice(0, -1) }
            : table
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
          seatsPerTable: seatsNumber, // Pass the correct seats number
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to add tables. Status: ${response.status}`);
      }
  
      const newTables = await response.json();
      setTablesData((prevTables) => [...prevTables, ...newTables.map((table: any) => ({
        ...table,
        seats: table.seats || [],
      }))]);
    } catch (error) {
      console.error("Error adding tables:", error);
    }
  };
  
 // Delete a specific table
 const handleDeleteTable = async (tableId: string) => {
  const isConfirmed = window.confirm("Are you sure you want to delete this table?");
  if (!isConfirmed) return; // Exit the function if the user cancels

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
  <div>
    <div className="border border-black flex flex-col justify-center gap-4 w-fit p-2 rounded-md">
      <h1 className="text-center font-bold text-xl">Add table and seats</h1>
      {/* Add Table UI */}
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
          {tablesData.map((table) => (
            <div key={table.id} className="p-4 block border rounded mb-2">
              <h2>Table {table.tableNumber}</h2>
              <p className="mb-4">Seats: {table.seats.length}</p>
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
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => handleDeleteTable(table.id)}
                >
                  Delete Table
                </Button>
              </div>
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