"use client";
import React, { useEffect, useState } from "react";
import { usePlaces } from "@/hooks/usePlaces";

interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
}

const ClosestPlaces = () => {
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [closestPlaces, setClosestPlaces] = useState<Place[]>([]);
  const { data: places, isLoading, isError } = usePlaces();

  // Fetch user's current location
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

  // Calculate distances and find the three closest places
  useEffect(() => {
    if (userPosition && places) {
      const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        // Haversine formula approximation
        const toRad = (value: number) => (value * Math.PI) / 180;
        const R = 6371; // Radius of Earth in km
        const dLat = toRad(lat2 - lat1);
        const dLng = toRad(lng2 - lng1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
      };

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
        .slice(0, 3); // Top 3 closest places

      setClosestPlaces(sortedPlaces);
    }
  }, [userPosition, places]);

  return (
    <div className="flex flex-col w-full h-fit relative min-h-14 bg-[#52208b] top-[-30px] z-10 p-4 text-white">
      <h2 className="text-lg font-bold mb-2">Nearby places. . .</h2>
      {isLoading && <p>Loading places...</p>}
      {isError && <p>Failed to load places.</p>}
      {closestPlaces.map((place, index) => (
        <div
          key={place.id}
          className="p-3 mb-2 bg-white text-black rounded shadow flex justify-between items-center"
        >
          <span>{index + 1}. {place.name}</span>
          <span>{place.distance.toFixed(2)} km</span>
        </div>
      ))}
    </div>
  );
};

export default ClosestPlaces;
