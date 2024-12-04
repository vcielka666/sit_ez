"use client";
import React from "react";
import Map from "@/components/map/Map"; // Assuming `Map` component is inside `components/Map`
import ClosestPlaces from "@/components/map/ClosestPlaces";

export default function UserPage() {
  return (
    
      <div id="map" className="px-1 h-[600px]">
        <Map onMarkerClick={() => {}} /> {/* No-op callback */}
        <ClosestPlaces />
        {/* <Filters /> */}
      </div>
    
  );
}
