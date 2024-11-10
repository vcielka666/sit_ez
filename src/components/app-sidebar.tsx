"use client";

import { Calendar, ChevronDown, Home, Inbox, Search, Settings } from "lucide-react";
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
import { useState } from "react";
import Image from "next/image";
import Logout from "./Logout";

type AppSidebarProps = {
  onSelectLocation: (location: string) => void;
};

const applicationItems = [
  {
    title: "Restaurant 1",
    icon: Home,
  },
  {
    title: "Restaurant 2",
    icon: Home,
  },
  {
    title: "Pub 1",
    icon: Home,
  },
];

const notificationsItems = [
  {
    title: "Create Notification",
    icon: Settings,
  },
  {
    title: "Set Happy Hour",
    icon: Inbox,
  },
  {
    title: "Search",
    icon: Search,
  },
];

export function AppSidebar({ onSelectLocation }: AppSidebarProps) {
  const [isAppOpen, setAppOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  return (
    <Sidebar>
      <Image className="w-[50%] rounded-full p-4"
        src="/logo.png"
        width="100"
        height="100"
        alt="logo"
        style={{ left: "50%", position: "relative", transform: "translateX(-50%)" }}
      />
      <SidebarContent>

        {/* Pubs/Restaurants Group */}
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
                  {applicationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild onClick={() => onSelectLocation(item.title)}>
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

        {/* Notifications and Happy Hours Group */}
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
