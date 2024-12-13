"use client";
import React, { useState, useEffect } from "react";
import DraggableSheet from "@/components/DraggableSheet";
import Map from "@/components/map/Map";
import ClosestPlaces from "@/components/map/ClosestPlaces";
import Filter from "@/components/Filter";
import { usePlaces } from "@/hooks/usePlaces";
import MoreDetailsComponent from "@/components/MoreDetailsComponent";
import Image from "next/image";
import { FaClock, FaDollarSign, FaPaw, FaWalking, FaWifi } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";

export default function UserPage() {
  const { data: places, isLoading, isError } = usePlaces();
  const [currentScreen, setCurrentScreen] = useState<"default" | "details">("default");
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<any[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [sheetHeight, setSheetHeight] = useState(80); 


  useEffect(() => {
    if (mapInstance) {
      google.maps.event.trigger(mapInstance, "resize");
    }
  }, [ mapInstance]);

  const handleZoomToPlace = (place: any) => {
    if (mapInstance && place.latitude && place.longitude) {
      mapInstance.setCenter({ lat: place.latitude, lng: place.longitude });
      mapInstance.setZoom(15);
    }
  };

  const handleFilterResult = (filtered: any[]) => {
    if (JSON.stringify(filteredPlaces) !== JSON.stringify(filtered)) {
      setFilteredPlaces(filtered);
    }
  };

  const goToDetails = (place: any) => {
    setIsAnimating(true); // Start animation
    setTimeout(() => {
      setSelectedPlace(place);
      setCurrentScreen("details");
      setIsAnimating(false); // Stop animation
    }, 300); // Match the duration of the CSS animation
  };

  const goBack = () => {
    setIsAnimating(true); // Start animation
    setTimeout(() => {
      setCurrentScreen("default");
      setIsAnimating(false); // Stop animation
    }, 300); // Match the duration of the CSS animation
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
    <div className="relative min-w-[320px] h-screen">
      {/* Main Screen */}
      <div
        className={`absolute inset-0 transition-transform duration-500 ${
          currentScreen === "default" ? (isAnimating ? "-translate-x-full" : "translate-x-0") : "translate-x-full"
        } bg-gray-100`}
      >
        <div
          id="map"
          className="absolute inset-0"
          style={{
            height: "100vh", // Fullscreen map
          }}
        >
          <Map
            onMarkerClick={() => {}}
            onMoreDetailsClick={goToDetails}
            filteredPlaces={filteredPlaces}
            mapInstance={mapInstance}
            setMapInstance={setMapInstance}
            sheetHeight={sheetHeight}
          />
        </div>
      </div>

      {/* Draggable Bottom Sheet */}
      {currentScreen === "default" && (
        <DraggableSheet
          minHeight={80} // Fully collapsed state
          maxHeight={window.innerHeight * 0.8} // Maximum drag-up state (80% of screen height)
          onHeightChange={(newHeight) => setSheetHeight(newHeight)}
        >
          <Filter
            filters={[
              { label: "Filters:", value: "Filters", icon: <FiSettings /> },
              { label: " < 5 km", value: "within5km", icon: <FaWalking /> },
              { label: "2 seats", value: "2seats" },
              { label: "4 seats", value: "4seats" },
              { label: "5+ seats", value: "5plus" },
              { label: "Events", value: "event" },
              { label: "Open Now", value: "openNow", icon: <FaClock /> },
              { label: "Price: $$", value: "priceMid", icon: <FaDollarSign /> },
              { label: "Wi-Fi", value: "wifi", icon: <FaWifi /> },
              { label: "Pet-Friendly", value: "petFriendly", icon: <FaPaw /> },
            ]}
            activeFilters={activeFilters}
            onFilterChange={setActiveFilters}
            places={places || []}
            onFilterResult={handleFilterResult}
          />
          <ClosestPlaces
            filteredPlaces={filteredPlaces}
            onPlaceClick={(place: any) => {
              handleZoomToPlace(place);
              goToDetails(place);
            }}
          />
        </DraggableSheet>
      )}

      {/* Details Screen */}
      {currentScreen === "details" && (
        <div
          className={`absolute inset-0 transition-transform duration-500 ${
            currentScreen === "details" ? (isAnimating ? "translate-x-full" : "translate-x-0") : "-translate-x-full"
          } bg-gray-200`}
        >
          <MoreDetailsComponent place={selectedPlace} onBack={goBack} />
        </div>
      )}
    </div>
  );
}
