"use client";
import React, { useEffect, useState } from "react";
import { usePlaces } from "@/hooks/usePlaces";
import { calculateDistance } from "../../../utils/geolocation";
import { FaClock, FaMapMarkerAlt, FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance?: number; // Make distance optional since it will be added later
  pictureUrls?: string[];
  description?: string;
}

const ClosestPlaces: React.FC<{
  filteredPlaces: Place[]; // Declare the type of filteredPlaces
  onPlaceClick: (place: Place) => void; // Declare the type of onPlaceClick
}> = ({  onPlaceClick }) => {
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
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
        .slice(0, 3);
  
      setClosestPlaces(sortedPlaces);
    }
  }, [userPosition, places]);

  return (
    <div className="flex flex-col w-full h-fit relative min-h-14 bg-[#52208b] z-10 p-2 top-[-10px] text-white">
      <h2 className="text-lg font-bold mb-2">Nearby</h2>
      {isLoading && <p>Loading places...</p>}
      {isError && <p>Failed to load places.</p>}
      {closestPlaces.map((place) => (
        <div
          key={place.id}
          className="p-2 mb-2 bg-white text-black rounded shadow flex justify-between items-center cursor-pointer"
          onClick={() => onPlaceClick(place)} 
        >
        
          <div>
            {place.pictureUrls && place.pictureUrls.length > 0 && (
                <div className="w-[80] h-[80px] rounded-sm">
                <img
                    src={place.pictureUrls[2]}
                    alt={`Image of ${place.name}`}
                    className="object-cover w-full h-full"
                  />
                </div>
             )}
          </div>

              <div className="flex flex-col w-full">

                        <div className="flex flex-inline items-center justify-between w-full">
                        <span className="left-0 ml-2">{place.name}</span>
                          <div className="flex flex-col items-center justify-center">
                          <FaMapMarkerAlt className="text-gray-500 mr-2" />
                            <span>{place.distance?.toFixed(2)} km</span>
                          </div>
                      </div>

                      <div className="flex items-start ml-2  w-full">
                          <span className=" flex text-yellow-500">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStarHalfAlt />
                          <FaRegStar />
                          </span>
                          <span className="ml-2 text-gray-600">(3.5)</span>
                      </div>

                      <div>
                          <div className="text-lg font-semibold flex items-center">
                            <FaClock className="ml-2 text-gray-500 mr-2" />
                            <div className="flex items-center justify-between w-full">
                              <span className="text-gray-600">8 AM - 10 PM</span>
                              <span className="text-[#978415]">$$$</span>
                            </div>
                          </div>
                          <p className="ml-2">
                            {place.description
                              ? `${place.description.slice(0, 33)}...`
                              : "No description available."}
                          </p>
                      </div>

                      
             </div>
        </div>
          ))}
      
    </div>
    
  );
};

export default ClosestPlaces;
