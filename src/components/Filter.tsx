"use client";
import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface FilterProps {
  filters: { label: string; value: string; icon?: React.ReactNode }[];
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
    if (activeFilters.includes("openNow")) {
      // const currentTime = new Date().getHours();
      // filteredPlaces = filteredPlaces.filter(
      //   (place) =>
      //     place.openingHours.start <= currentTime &&
      //     place.openingHours.end >= currentTime
      // );
    }
    if (activeFilters.includes("priceMid")) {
      filteredPlaces = filteredPlaces.filter((place) => place.price === "$$");
    }
    if (activeFilters.includes("wifi")) {
      filteredPlaces = filteredPlaces.filter((place) => place.hasWiFi);
    }
    if (activeFilters.includes("petFriendly")) {
      filteredPlaces = filteredPlaces.filter((place) => place.isPetFriendly);
    }

    onFilterResult(filteredPlaces);
  }, [activeFilters, places, onFilterResult]);

  return (
    <div className="bg-[#52208b] relative w-full z-40">
      {/* Unified layout for all screens */}
      <Swiper
        spaceBetween={10}
        slidesPerView="auto"
        freeMode={true}
        className="p-2"
      >
        {filters.map((filter) => (
          <SwiperSlide key={filter.value} className="!w-auto mt-2">
            {filter.value === "Filters" ? (
              // Informational filter style
              <div className="px-3 py-2 text-xs rounded-full text-white flex items-center gap-1">
                {filter.icon && <span className="text-lg">{filter.icon}</span>}
                
              </div>
            ) : (
              // Toggleable button
              <button
                onClick={() => toggleFilter(filter.value)}
                className={`px-2 py-2 my-1 rounded-full text-xs border flex items-center gap-1 ${
                  activeFilters.includes(filter.value)
                    ? "bg-green-800 text-white border-black shadow-sm shadow-green-500/50"
                    : "bg-white text-black border-black"
                }`}
              >
                {filter.icon && <span className="text-lg">{filter.icon}</span>}
                <span>{filter.label}</span>
              </button>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Filter;
