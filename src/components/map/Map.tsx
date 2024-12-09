"use client";
import React, { useRef, useState, useEffect } from "react";
import { Button, buttonVariants } from "../ui/button";
import { FaSearch } from "react-icons/fa";
import { usePlaces } from "@/hooks/usePlaces";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { calculateDistance } from "../../../utils/geolocation";

interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
  pictureUrls?: string[];
  freeTables?: {
    id: string;
    tableNumber: number;
    totalSeats: number;
    freeSeats: number;
  }[];
}

const Map: React.FC<{
  onMarkerClick: (place: Place) => void;
  onMoreDetailsClick: (place: any) => void;
  filteredPlaces: Place[];
}> = ({ onMarkerClick, onMoreDetailsClick, filteredPlaces }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [defaultPosition] = useState({ lat: 50.0755, lng: 14.4378 }); // Prague
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const { data: places } = usePlaces(); // Fetch places using React Query

  useEffect(() => {
    // Initialize the map only once
    if (!mapRef.current || typeof google === "undefined") {
      console.error("Google Maps API is not loaded or mapRef is null");
      return;
    }
  
    if (!mapInstance) {
      const map = new google.maps.Map(mapRef.current, {
        center: defaultPosition,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: false,
        gestureHandling: "greedy",
      });
  
      setMapInstance(map);
    }
  }, [mapInstance, mapRef]);
  
  const markersRef = useRef<google.maps.Marker[]>([]);
  
  useEffect(() => {
    if (!mapInstance || !filteredPlaces) return;
  
    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  
    // Add markers for filtered or fallback places
    const placesToRender = filteredPlaces.length ? filteredPlaces : places || [];
  
    placesToRender.forEach((place: Place) => {
      if (place.latitude && place.longitude) {
        const marker = new google.maps.Marker({
          position: { lat: place.latitude, lng: place.longitude },
          map: mapInstance,
          title: `${place.name} - Free Tables: ${place.freeTables?.length || 0}`,
          icon: {
            url:
              selectedPlace?.id === place.id
                ? "/markerIconActive.png" // Active icon
                : "/markerIcon.png", // Default icon
            scaledSize: new google.maps.Size(40, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(20, 20),
          },
        });
  
        marker.addListener("click", () => {
          const distance = userPosition
            ? calculateDistance(
                userPosition.lat,
                userPosition.lng,
                place.latitude,
                place.longitude
              )
            : null;
          setSelectedPlace({ ...place, distance });
          mapInstance?.setCenter({ lat: place.latitude, lng: place.longitude }); 
          mapInstance?.setZoom(15); 
          onMarkerClick(place);
        });
  
        markersRef.current.push(marker);
      }
    });
  }, [mapInstance, filteredPlaces, places, userPosition, selectedPlace]);
  
  const updateUserMarker = (position: { lat: number; lng: number }) => {
    if (!mapInstance) return;
  
    if (!userMarkerRef.current) {
      userMarkerRef.current = new google.maps.Marker({
        position,
        map: mapInstance,
        title: "Your Position",
        icon: {
    
          
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10, 
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "white",
          strokeWeight: 2,
        },
      });
    } else {
      userMarkerRef.current.setPosition(position);
    }
  };
  
  useEffect(() => {
    if (!mapInstance || !userPosition) return;
  
    // Update or create the user marker whenever the position changes
    updateUserMarker(userPosition);
  
    return () => {
      // Clean up the marker on unmount
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
        userMarkerRef.current = null;
      }
    };
  }, [mapInstance, userPosition]);
  
  
  // Geolocation effect
  useEffect(() => {
    const getGeolocation = () => {
      const successCallback = (position: GeolocationPosition) => {
        const userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserPosition(userPosition);
        mapInstance?.setCenter(userPosition);
        updateUserMarker(userPosition); // Add user position marker
      };
  
      const errorCallback = (error: GeolocationPositionError | null) => {
        console.warn("Geolocation error:", error?.message || "Unknown error");
        alert("Unable to fetch your location. Rendering default markers.");
        mapInstance?.setCenter(defaultPosition);
      };
      
      if (navigator.permissions) {
        navigator.permissions
          .query({ name: "geolocation" as PermissionName })
          .then((permission) => {
            if (permission.state === "denied") {
              alert("Please enable location access in your browser settings.");
              errorCallback(null);
              return;
            }
      
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            });
          })
          .catch(() => {
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            });
          });
      } else {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      }
      
    };
  
    getGeolocation();
  }, [mapInstance]);
  
  
  
  const handleSearch = () => {
    if (!mapInstance || !places?.length || !searchQuery.trim()) return;
  
    const foundPlace = places.find((place) =>
      place.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    if (foundPlace && foundPlace.latitude && foundPlace.longitude) {
      mapInstance.setCenter({ lat: foundPlace.latitude, lng: foundPlace.longitude });
      mapInstance.setZoom(15);
    } else {
      alert("No matching place found.");
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
      <div className="absolute left-1/2 transform -translate-x-1/2 bg-white lg:pt-1 shadow flex items-center rounded z-10 lg:rounded-none lg:w-full lg:top-0 w-3/5 top-5 ">
        <Button
          onClick={handleSearch}
          className={`${buttonVariants({ variant: "default" })} bg-[#52208b] mr-1 text-white px-4 py-2 rounded-[6px] flex items-center`}
        >
          <FaSearch />
        </Button>
        <input
          onKeyDown={searchOnKeyDown}
          type="text"
          placeholder="Search places..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-gray-800 outline-none"
        />
      </div>

      {/* Google Map */}
      <div ref={mapRef} className="w-full h-full"></div>

      
   {/* Selected Place Modal */}
{selectedPlace && (
  <div
    className={`absolute w-full bottom-[30px] left-0 bg-white p-4 rounded shadow max-w-sm animate-rollUp`}
    style={{ transform: "translateY(0)", opacity: 1 }}
  >
    <h2 className="text-lg font-bold">{selectedPlace.name}</h2>

    {selectedPlace.distance && (
      <p className="text-gray-600 mb-2">Distance: {selectedPlace.distance.toFixed(2)} km</p>
    )}

    {selectedPlace.description && (
      <p className="text-gray-700 mb-2">{selectedPlace.description}</p>
    )}

    {selectedPlace.pictureUrls && selectedPlace.pictureUrls.length > 0 && (
      <Carousel className="w-full max-w-sm">
        <CarouselContent className="-ml-1">
          {selectedPlace.pictureUrls.map((url: string, index: number) => (
            <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center">
                    <img
                      src={url}
                      alt={`Image ${index + 1} of ${selectedPlace.name}`}
                      className="w-full h-full"
                      loading="lazy"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    )}

    <h3 className="mt-4 font-bold">Tables</h3>
    {selectedPlace.freeTables && selectedPlace.freeTables.length > 0 ? (
      <ul className="list-disc ml-4">
        {selectedPlace.freeTables.map((table: any) => (
          <li key={table.id}>
            Table {table.tableNumber}: {table.totalSeats} seats
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No tables available.</p>
    )}

    <div className="mt-4 flex justify-between">
      <button
        onClick={() => setSelectedPlace(null)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Close
      </button>
      <button
        onClick={() => onMoreDetailsClick(selectedPlace)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        More Details
      </button>
    </div>
  </div>
)}


    </div>
  );
};

export default Map;
