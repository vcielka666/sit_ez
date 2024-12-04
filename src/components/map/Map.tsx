"use client";
import React, { useRef, useState, useEffect } from "react";
import { Button, buttonVariants } from "../ui/button";
import { FaSearch } from "react-icons/fa";
import { usePlaces } from "@/hooks/usePlaces";
import Cookies  from "js-cookie";

interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  freeTables: {
    id: string;
    totalSeats: number;
  }[];
}


const Map: React.FC<{ onMarkerClick: (place: Place) => void }> = ({ onMarkerClick }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [defaultPosition] = useState({ lat: 50.0755, lng: 14.4378 }); // Prague
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: places, isLoading, isError } = usePlaces(); // Fetch places using React Query

  useEffect(() => {
    const initMap = (position: { lat: number; lng: number }) => {
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
  
      setMapInstance(map);
  
      if (!places || isLoading || isError) {
        console.warn("Loading map data or no places available.");
        return;
      }
  
      // Add markers for places
      places.forEach((place: Place) => {
  
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
        }
      });
    };
  
    const geolocationAllowed = Cookies.get("geolocationAllowed");
  
    if (geolocationAllowed === "true") {
      // If geolocation was previously allowed, skip asking for permission
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          initMap(userPosition);
        },
        () => {
          console.warn("Geolocation failed. Using default position.");
          initMap(defaultPosition);
        }
      );
    } else {
      // Ask for geolocation permission
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          Cookies.set("geolocationAllowed", "true", {
            expires: 7,
            secure: true,
            sameSite: "strict",
          }); // Set cookie for 7 days
          initMap(userPosition);
        },
        () => {
          
          alert("Unable to fetch your location. Please allow location access in your browser.");
          initMap(defaultPosition);
        }
      );
    }
  }, [places, isLoading, isError]); // Dependencies
  

  const handleSearch = () => {
    if (!mapInstance || !places?.length || !searchQuery.trim()) return;

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

  const searchOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full h-full relative">
      {/* Search Bar */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-white p-1 shadow flex items-center z-10 w-full">
        <input
          onKeyDown={searchOnKeyDown}
          type="text"
          placeholder="Search for a pub..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-gray-800 outline-none"
        />
        <Button
          onClick={handleSearch}
          className={`${buttonVariants({ variant: "default" })} bg-[#52208b] text-white px-4 py-2 rounded-r flex items-center gap-2`}
        >
          <FaSearch />
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
