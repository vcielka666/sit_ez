"use client";

import { ChevronDown, Home, Inbox, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { useState, useEffect } from "react";
import Image from "next/image";
import Logout from "./Logout";
import { Button } from "./ui/button";


type Place = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
  pictureUrl?: string;
};

type AppSidebarProps = {
  onSelectLocation: (location: string) => void;
};

type NotificationItem = {
  title: string;
  icon: React.ComponentType;
};

const notificationsItems: NotificationItem[] = [
  {
    title: "Create Notification",
    icon: Settings,
  },
  {
    title: "Set Happy Hour",
    icon: Inbox,
  },
];

export function AppSidebar({ onSelectLocation }: AppSidebarProps) {
  const [isAppOpen, setAppOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [pictures, setPictures] = useState<File[]>([]);

  // Fetch places on mount
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch("/api/getPlace");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPlaces(data);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };

    fetchPlaces();
  }, []);

  // Add new place
  
const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    setPictures(Array.from(e.target.files)); // Convert FileList to an array
  }
};

const addNewPlace = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (!newPlaceName.trim() || latitude === null || longitude === null) {
    console.error("Missing required fields");
    return;
  }

  let pictureUrls: string[] = []; // Initialize an array for URLs
  if (pictures.length > 0) {
    try {
      for (const picture of pictures) {
        const formData = new FormData();
        formData.append("file", picture);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
        
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await res.json();
        pictureUrls.push(result.secure_url); // Add the URL to the array
      }
    } catch (err) {
      console.error("Error uploading pictures:", err);
      return;
    }
  }

  try {
    const response = await fetch("/api/addPlace", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newPlaceName,
        latitude,
        longitude,
        description,
        pictureUrls, // Send the array of image URLs
      }),
    });

    const newPlace = await response.json();
    setPlaces((prev) => [...prev, newPlace]);
    setNewPlaceName("");
    setLatitude(null);
    setLongitude(null);
    setDescription("");
    setPictures([]); // Reset pictures
  } catch (err) {
    console.error("Error adding place:", err);
  }
};

  // Delete a place
  const deletePlace = async (id: string) => {
    try {
      const response = await fetch(`/api/deletePlace?placeId=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setPlaces((prev) => prev.filter((place) => place.id !== id));
      } else {
        console.error("Failed to delete place");
      }
    } catch (error) {
      console.error("Error deleting place:", error);
    }
  };


  return (
    <Sidebar>
      <Image
        className="w-[50%] rounded-full p-4"
        src="/logo.png"
        width="100"
        height="100"
        alt="logo"
        style={{ left: "50%", position: "relative", transform: "translateX(-50%)" }}
      />
      <SidebarContent>
        <Collapsible open={isAppOpen} onOpenChange={setAppOpen}>
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex items-center">
                Pubs/Restaurants
                <ChevronDown className={`ml-auto transition-transform ${isAppOpen ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {places.map((place) => (
                    <SidebarMenuItem key={place.id}>
                      <SidebarMenuButton asChild onClick={() => onSelectLocation(place.name)}>
                        <button className="flex items-center gap-2 w-full justify-between">
                          <span className="flex items-center gap-2">
                            <Home />
                            <span>{place.name}</span>
                          </span>
                          <span
                            className="text-red-600 hover:text-red-800 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePlace(place.id);
                            }}
                          >
                            X
                          </span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>

                {/* Add Place Form */}
                <div className="my-2 border border-black w-full"></div>
                <h1 className="text-lg font-bold mb-2 text-center">Add new place</h1>
                <form className="w-full flex flex-col mt-4" onSubmit={addNewPlace}>
                <label htmlFor="description">Add name and GPS coordinates</label>
                  <input
                    type="text"
                    name="addNewPlace"
                    placeholder="Insert name"
                    value={newPlaceName}
                    onChange={(e) => setNewPlaceName(e.target.value)}
                    className="border border-black rounded-sm p-2"
                  />
                  <input
                    type="number"
                    name="latitude"
                    placeholder="Latitude"
                    value={latitude || ""}
                    onChange={(e) => setLatitude(parseFloat(e.target.value))}
                    className="border border-black rounded-sm p-2 mt-2"
                  />
                  <input
                    type="number"
                    name="longitude"
                    placeholder="Longitude"
                    value={longitude || ""}
                    onChange={(e) => setLongitude(parseFloat(e.target.value))}
                    className="border border-black rounded-sm p-2 mt-2"
                  />

                  <label className="my-2" htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-2 rounded"
                    placeholder="Short description about the place"
                  />

                  <label className="my-2" htmlFor="picture">Picture</label>
                  <input
  type="file"
  id="pictures"
  multiple // Allow multiple file selection
  onChange={handlePictureUpload}
  accept="image/*"
  className="border p-2 rounded"
/>


                  <Button type="submit" className="p-2 mt-2 w-fit bg-green-800">
                    Add New Place
                  </Button>
                </form>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        {/* Notifications & Happy Hours */}
        <Collapsible open={isNotificationsOpen} onOpenChange={setNotificationsOpen}>
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex items-center">
                Notifications & Happy Hours
                <ChevronDown className={`ml-auto transition-transform ${isNotificationsOpen ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                {notificationsItems.map((item: NotificationItem) => (
  <SidebarMenuItem key={item.title}>
    <SidebarMenuButton asChild>
      <button className="flex items-center gap-2">
        <item.icon />
        <span>{item.title}</span>
      </button>
    </SidebarMenuButton>
  </SidebarMenuItem>
))}

                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <Logout />
    </Sidebar>
  );
}
