"use client";
import React from "react";
import Map from "@/components/map/Map"; // Assuming `Map` component is inside `components/Map`

export default function UserPage() {
  return (
    
      <div id="map" className="px-1 h-[500px]">
        <Map onMarkerClick={() => {}} /> {/* No-op callback */}
      </div>
    
  );
}
