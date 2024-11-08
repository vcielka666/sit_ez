interface Table {
    id: number;
    freeSeats: string; // Format: "occupied/total" (e.g., "3/8")
  }
  
  const tableData: Record<string, Table[]> = {
    "Restaurant 1": [
      { id: 1, freeSeats: "2/8" },
      { id: 2, freeSeats: "4/7" },
    ],
    "Restaurant 2": [
      { id: 1, freeSeats: "5/10" },
      { id: 2, freeSeats: "3/5" },
    ],
    "Pub 1": [
      { id: 1, freeSeats: "6/10" },
      { id: 2, freeSeats: "1/3" },
    ],
  };
  
  // Helper function to calculate total free seats
  const calculateTotalFreeSeats = (data: Record<string, Table[]>) => {
    let totalFree = 0;
  
    for (const tables of Object.values(data)) {
      for (const table of tables) {
        const [occupied, total] = table.freeSeats.split("/").map(Number);
        totalFree += total - occupied;
      }
    }
  
    return totalFree;
  };
  
  interface DashboardProps {
    selectedLocation: keyof typeof tableData | "default";
  }
  
  const Dashboard = ({ selectedLocation }: DashboardProps) => {
    const totalFreeSeats = calculateTotalFreeSeats(tableData);
    const tablesToDisplay = selectedLocation === "default" ? [] : tableData[selectedLocation];
  
    return (
      <div className="flex flex-col items-center gap-8">
        {/* Display Total Free Seats */}
        <div>
          <h2>Total Free Seats In Your Bars</h2>
          <p className="text-xl font-bold">{totalFreeSeats}</p>
        </div>
  
        {/* Display Selected Location's Tables */}
        {selectedLocation !== "default" && (
          <div>
            <h2>Tables for {selectedLocation}</h2>
            <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
              {tablesToDisplay.map((table, index) => (
                <div key={index} className="flex flex-col justify-center items-center">
                  <table className="table-auto border-collapse border border-gray-300 mt-4">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 px-4 py-2">Free Seats</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">{table.freeSeats}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default Dashboard;
  