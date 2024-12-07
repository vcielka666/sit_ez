"use client";
import React, { useState } from "react";
import Map from "@/components/map/Map";
import ClosestPlaces from "@/components/map/ClosestPlaces";
import Filter from "@/components/Filter";
import { usePlaces } from "@/hooks/usePlaces";
import MoreDetailsComponent from "@/components/MoreDetailsComponent";
import Image from "next/image";
import { FaWalking } from "react-icons/fa";

export default function UserPage() {
  const { data: places, isLoading, isError } = usePlaces(); // Fetch places using React Query
  const [currentScreen, setCurrentScreen] = useState<"default" | "details">("default");
  const [selectedPlace, setSelectedPlace] = useState<any>(null); // For "More Details"
  const [activeFilters, setActiveFilters] = useState<string[]>([]); // Shared filter state
  const [filteredPlaces, setFilteredPlaces] = useState<any[]>([]); // Filtered places
  const [isAnimating, setIsAnimating] = useState<boolean>(false); // Track animation state

  const handleFilterResult = (filtered: any[]) => {
    if (JSON.stringify(filteredPlaces) !== JSON.stringify(filtered)) {
      setFilteredPlaces(filtered);
    }
  };

  const goToDetails = (place: any) => {
    setSelectedPlace(place);
    setIsAnimating(true); // Start animation
    setTimeout(() => {
      setCurrentScreen("details");
      setIsAnimating(false); // Stop animation
    }, 50); // Match the duration of the swipe animation
  };

  const goBack = () => {
    setIsAnimating(true); // Start animation
    setTimeout(() => {
      setCurrentScreen("default");
      setIsAnimating(false); // Stop animation
    }, 50); // Match the duration of the swipe animation
  };

  if (isLoading) {
    return (
      <div className="text-center flex flex-col items-center justify-center w-screen h-screen">
        <Image src="/loadingIcon.gif" alt="Loading" width={50} height={50} />
      </div>
    );
  }
  if (isError) {
    return <p>Failed to load places. Try again later.</p>;
  }

  return (
    <div className="relative">
      {/* Main Screen */}
      <div
        className={`absolute inset-0 transition-transform duration-500 ${
          currentScreen === "default" ? "translate-x-0" : "-translate-x-full"
        } ${currentScreen === "details" && !isAnimating ? "hidden" : ""} bg-gray-100`}
      >
        <div id="map" className="px-1 h-[550px]">
          <Map
            onMarkerClick={() => {}}
            onMoreDetailsClick={goToDetails}
            filteredPlaces={filteredPlaces} // Use filtered data
          />
          <div className="bg-[#52208b] w-full h-fit">
            <Filter
              filters={[
                { label: "Within 5 km", value: "within5km", icon: <FaWalking /> },
                { label: "2 seats", value: "2seats" },
                { label: "4 seats", value: "4seats" },
                { label: "5+ seats", value: "5plus" },
                { label: "Events", value: "event" },
              ]}
              activeFilters={activeFilters}
              onFilterChange={setActiveFilters}
              places={places || []}
              onFilterResult={handleFilterResult}
            />
            <ClosestPlaces
              filteredPlaces={filteredPlaces} // Use filtered data
              onMoreDetailsClick={goToDetails}
            />
          </div>
        </div>
      </div>

      {/* Details Screen */}
      <div
        className={`absolute inset-0 transition-transform duration-500 ${
          currentScreen === "details" ? "translate-x-0" : "translate-x-full"
        } ${currentScreen === "default" && !isAnimating ? "hidden" : ""} bg-gray-200`}
      >
        <MoreDetailsComponent place={selectedPlace} onBack={goBack} />
      </div>
    </div>
  );
}
