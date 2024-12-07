"use client";
import React, { useEffect } from "react";

interface FilterProps {
  filters: { label: string; value: string, icon?: React.ReactNode }[];
  activeFilters: string[];
  onFilterChange: (activeFilters: string[]) => void;
  places: any[];
  onFilterResult: (filteredPlaces: any[]) => void;
}

const Filter: React.FC<FilterProps> = ({
  filters,
  activeFilters,
  onFilterChange,
  places,
  onFilterResult,
}) => {
  const toggleFilter = (value: string) => {
    if (activeFilters.includes(value)) {
      onFilterChange(activeFilters.filter((filter) => filter !== value));
    } else {
      onFilterChange([...activeFilters, value]);
    }
  };

  useEffect(() => {
    // Filter logic only runs when activeFilters or places change
    let filteredPlaces = places;

    if (activeFilters.includes("within5km")) {
      filteredPlaces = filteredPlaces.filter((place) => place.distance <= 5);
    }
    if (activeFilters.includes("2seats")) {
      filteredPlaces = filteredPlaces.filter((place) =>
        place.freeTables.some((table: any) => table.totalSeats === 2)
      );
    }
    if (activeFilters.includes("4seats")) {
      filteredPlaces = filteredPlaces.filter((place) =>
        place.freeTables.some((table: any) => table.totalSeats === 4)
      );
    }
    if (activeFilters.includes("5plus")) {
      filteredPlaces = filteredPlaces.filter((place) =>
        place.freeTables.some((table: any) => table.totalSeats >= 5)
      );
    }
    if (activeFilters.includes("event")) {
      filteredPlaces = filteredPlaces.filter((place) => place.hasEvent);
    }

    onFilterResult(filteredPlaces); // Update filtered places
  }, [activeFilters, places, onFilterResult]);

  return (
    <div className="flex gap-2 bg-[#52208b] relative w-full justify-around overflow-hidden top-[-30px] z-40">
    {filters.map((filter) => (
      <button
        key={filter.value}
        onClick={() => toggleFilter(filter.value)}
        className={`px-2 py-2 rounded-full mt-2 text-xs border flex items-center gap-1 ${
          activeFilters.includes(filter.value)
            ? "bg-green-800 text-white border-black shadow-sm shadow-green-500/50"
            : "bg-white text-black border-black"
        }`}
      >
        {filter.icon && <span className="text-lg">{filter.icon}</span>} {/* Render icon */}
        <span>{filter.label}</span> {/* Render label */}
      </button>
    ))}
  </div>
  );
};

export default Filter;
