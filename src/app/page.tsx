"use client";
import React, { useState } from "react";
import Map from "@/components/map/Map";
import ClosestPlaces from "@/components/map/ClosestPlaces";
import MoreDetailsComponent from "@/components/MoreDetailsComponent";

export default function UserPage() {
  const [currentScreen, setCurrentScreen] = useState<"default" | "details">("default");
  const [selectedPlace, setSelectedPlace] = useState<any>(null); // Track selected place

  const goToDetails = (place: any) => {
    setSelectedPlace(place); // Pass full place object, including `distance`
    setCurrentScreen("details");
  };

  const goBack = () => {
    setCurrentScreen("default");
  };

  return (
    <div className="">
      {/* Main Screen */}
      <div
        className={`absolute inset-0 transition-transform duration-500 ${
          currentScreen === "default" ? "translate-x-0" : "-translate-x-full"
        } bg-gray-100`}
      >
        <div id="map" className="px-1 h-[600px]">
          <Map onMarkerClick={() => {}} onMoreDetailsClick={goToDetails} />
          <ClosestPlaces onMoreDetailsClick={goToDetails} /> {/* Pass `goToDetails` */}
        </div>
      </div>

      {/* Details Screen */}
      <div
        className={`absolute inset-0 transition-transform duration-500 ${
          currentScreen === "details" ? "translate-x-0" : "translate-x-full"
        } bg-gray-200`}
      >
        <MoreDetailsComponent place={selectedPlace} onBack={goBack} />
      </div>
    </div>
  );
}
