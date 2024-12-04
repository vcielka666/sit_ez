"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "../ui/button";

interface MapProps {
  onMarkerClick: (place: any) => void; // Callback when a marker is clicked
}

const Map: React.FC<MapProps> = ({ onMarkerClick }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [defaultPosition] = useState({ lat: 50.0755, lng: 14.4378 }); // Prague
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [places, setPlaces] = useState<any[]>([]); // Store all fetched places
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null); // Map instance
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search input state

  useEffect(() => {
    const initMap = async (position: { lat: number; lng: number }) => {
      if (typeof google === "undefined" || !mapRef.current) {
        console.error("Google Maps API is not loaded or mapRef is null");
        return;
      }

      const map = new google.maps.Map(mapRef.current, {
        center: position,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: false,
        gestureHandling: "greedy",
      });

      setMapInstance(map); // Store map instance

      try {
        const response = await fetch("/api/public/getPlace");
        if (!response.ok) {
          console.warn("Failed to fetch places. Status:", response.status);
          return;
        }

        const fetchedPlaces = await response.json();
        setPlaces(fetchedPlaces); // Store all places

        if (!fetchedPlaces || fetchedPlaces.length === 0) {
          console.warn("No places available to display markers.");
          return;
        }

        fetchedPlaces.forEach((place: any) => {
          if (place.latitude && place.longitude) {
            const marker = new google.maps.Marker({
              position: { lat: place.latitude, lng: place.longitude },
              map,
              title: `${place.name} - Free Tables: ${place.freeTables.length}`,
              icon: {
                url: "/marker.png",
                scaledSize: new google.maps.Size(40, 40),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(20, 20),
              },
            });

            marker.addListener("click", () => {
              setSelectedPlace(place);
              onMarkerClick(place);
            });
          } else {
            console.warn(`Place ${place.name} is missing latitude or longitude.`);
          }
        });
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          initMap(userPosition);
        },
        () => {
          console.warn("User denied geolocation or it failed. Using default position.");
          initMap(defaultPosition);
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser. Using default position.");
      initMap(defaultPosition);
    }
  }, [onMarkerClick, defaultPosition]);

  const handleSearch = () => {
    if (!mapInstance || !places.length || !searchQuery.trim()) return;

    const foundPlace = places.find((place) =>
      place.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (foundPlace && foundPlace.latitude && foundPlace.longitude) {
      mapInstance.setCenter({ lat: foundPlace.latitude, lng: foundPlace.longitude });
      mapInstance.setZoom(15); // Zoom in to the pub
    } else {
      alert("No matching pub found.");
    }
  };

  return (
    <div className="w-full h-full relative">
      {/* Search Bar */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-white p-1 shadow flex items-center z-10 w-full">
        <input
          type="text"
          placeholder="Search for a pub..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-gray-800 outline-none"
        />
        <Button
          onClick={handleSearch}
          className={`${buttonVariants({ variant: "default" })} bg-blue-500 text-white px-4 py-2 rounded-r`}

        >
          Search
        </Button>
      </div>

      {/* Google Map */}
      <div ref={mapRef} className="w-full h-full"></div>

      {/* Selected Place Modal */}
      {selectedPlace && (
        <div className="absolute bottom-10 left-10 bg-white p-4 rounded shadow max-w-sm">
          <h2 className="text-lg font-bold">{selectedPlace.name}</h2>
          <p>Total Free Tables: {selectedPlace.freeTables.length}</p>
          <ul>
            {selectedPlace.freeTables.map((table: any) => (
              <li key={table.id}>
                Table {table.tableNumber} ({table.totalSeats} seats)
              </li>
            ))}
          </ul>
          <button
            onClick={() => setSelectedPlace(null)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Map;
