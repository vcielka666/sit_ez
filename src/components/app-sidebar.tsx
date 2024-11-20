"use client";

import {ChevronDown, Home, Inbox, Settings } from "lucide-react";
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
};

type AppSidebarProps = {
  onSelectLocation: (location: string) => void;
};

const notificationsItems = [
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

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch("/api/getPlace");
        console.log("Raw response:", response);
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log("Parsed data:", data);
        setPlaces(data);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };
    

    fetchPlaces();
  }, []);

  const addNewPlace = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newPlaceName.trim()) return;

    try {
      const response = await fetch("/api/addPlace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newPlaceName }),
      });
      const newPlace = await response.json();
      setPlaces((prev) => [...prev, newPlace]);
      setNewPlaceName("");
    } catch (err) {
      console.error("Error adding place:", err);
    }
  };

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

                <form className="w-full flex flex-col mt-4" onSubmit={addNewPlace}>
                  <input
                    type="text"
                    name="addNewPlace"
                    placeholder="Insert name"
                    value={newPlaceName}
                    onChange={(e) => setNewPlaceName(e.target.value)}
                    className="border border-black rounded-sm p-2"
                  />
                  <Button type="submit" className="p-2 mt-2 w-fit bg-green-800">
                    Add New Place
                  </Button>
                </form>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

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
                  {notificationsItems.map((item) => (
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
