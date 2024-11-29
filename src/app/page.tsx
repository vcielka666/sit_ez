"use client";
import React, { useState } from "react";
import Map from "@/components/map/Map"; // Assuming `Map` component is inside `components/Map`


export default function UserPage() {
  const [selectedPlace, setSelectedPlace] = useState(null); // Holds the selected place data for the marker

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Discover Pubs and Restaurants</h1>
      <div id="map" className="mt-4 h-[500px]">
        <Map onMarkerClick={setSelectedPlace} /> {/* Pass callback to handle marker clicks */}
      </div>

    </div>
  );
}
