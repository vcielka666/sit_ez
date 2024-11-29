"use client";
import React, { useEffect, useRef, useState } from "react";

interface MapProps {
  onMarkerClick: (place: any) => void; // Callback when a marker is clicked
}

const Map: React.FC<MapProps> = ({ onMarkerClick }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [defaultPosition] = useState({ lat: 50.0755, lng: 14.4378 }); // Prague

  useEffect(() => {
    const initMap = async (position: { lat: number; lng: number }) => {
      if (typeof google === "undefined" || !mapRef.current) {
        console.error("Google Maps API is not loaded or mapRef is null");
        return;
      }

      // Initialize the map with the provided position
      const map = new google.maps.Map(mapRef.current, {
        center: position,
        zoom: 12,
      });

      try {
        // Fetch places from your API
        const response = await fetch("/api/public/getPlace");
        if (!response.ok) {
          console.warn("Failed to fetch places. Status:", response.status);
          return; // Exit if API call fails
        }

        const places = await response.json();

        // If there are no places, log a warning and return
        if (!places || places.length === 0) {
          console.warn("No places available to display markers.");
          return;
        }

        // Add markers to the map with free seats and tables information
        places.forEach((place: any) => {
          if (place.latitude && place.longitude) {
            const marker = new google.maps.Marker({
              position: { lat: place.latitude, lng: place.longitude },
              map,
              title: `${place.name} - Free Seats: ${place.totalFreeSeats}, Tables: ${place.totalTables}`,
              icon: {
                url: "/marker.png",
                scaledSize: new google.maps.Size(40, 40), // Scale the icon to 40x40 pixels
                origin: new google.maps.Point(0, 0), // The origin point of the icon (top-left corner)
                anchor: new google.maps.Point(20, 20), // Anchor point of the icon (center of the image)
              },
            });
        
            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div>
                  <h2>${place.name}</h2>
                  <p><strong>Free Seats:</strong> ${place.totalFreeSeats}</p>
                  <p><strong>Total Tables:</strong> ${place.totalTables}</p>
                </div>
              `,
            });

            // Open InfoWindow on marker click
            marker.addListener("click", () => {
              infoWindow.open(map, marker);
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

    // Use Geolocation API to get the user's location
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
          initMap(defaultPosition); // Fall back to default position
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser. Using default position.");
      initMap(defaultPosition); // Fall back to default position
    }
  }, [onMarkerClick, defaultPosition]);

  return <div ref={mapRef} className="w-full h-full"></div>;
};

export default Map;
