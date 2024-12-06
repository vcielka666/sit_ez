"use client";
import React, { useEffect, useState } from "react";
import { usePlaces } from "@/hooks/usePlaces";
import { calculateDistance } from "../../../utils/geolocation";

interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
}

const ClosestPlaces = ({ onMoreDetailsClick }: { onMoreDetailsClick: (place: Place) => void }) => {
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [closestPlaces, setClosestPlaces] = useState<Place[]>([]);
  const { data: places, isLoading, isError } = usePlaces();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.warn("Unable to fetch geolocation.");
        }
      );
    }
  }, []);

  useEffect(() => {
    if (userPosition && places) {
      const sortedPlaces = places
        .map((place: Place) => ({
          ...place,
          distance: calculateDistance(
            userPosition.lat,
            userPosition.lng,
            place.latitude,
            place.longitude
          ),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);
  
      setClosestPlaces(sortedPlaces);
    }
  }, [userPosition, places]);

  return (
    <div className="flex flex-col w-full h-fit relative min-h-14 bg-[#52208b] top-[-30px] z-10 p-4 text-white">
      <h2 className="text-lg font-bold mb-2">Nearby</h2>
      {isLoading && <p>Loading places...</p>}
      {isError && <p>Failed to load places.</p>}
      {closestPlaces.map((place) => (
        <div
          key={place.id}
          className="p-3 mb-2 bg-white text-black rounded shadow flex justify-between items-center cursor-pointer"
          onClick={() => onMoreDetailsClick(place)} // Pass place with `distance`
        >
          <span>{place.name}</span>
          <span>{place.distance.toFixed(2)} km</span>
        </div>
      ))}
    </div>
  );
};

export default ClosestPlaces;
