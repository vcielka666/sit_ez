"use client";
import React from "react";
import Map from "@/components/map/Map"; // Assuming `Map` component is inside `components/Map`

export default function UserPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Discover Pubs and Restaurants</h1>
      <div id="map" className="mt-4 h-[500px]">
        <Map onMarkerClick={() => {}} /> {/* No-op callback */}
      </div>
    </div>
  );
}
