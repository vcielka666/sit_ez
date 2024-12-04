import { useQuery } from "@tanstack/react-query";

const fetchPlaces = async (): Promise<any[]> => { // Replace `YourPlaceType` with the correct type
  const response = await fetch("/api/public/getPlace");
  if (!response.ok) {
    throw new Error("Failed to fetch places");
  }
  return response.json();
};

export const usePlaces = () => {
  return useQuery({
    queryKey: ["places"], // Unique key for the query
    queryFn: fetchPlaces, // Query function to fetch data
    staleTime: 300000, // Cache data for 5 minutes
    refetchOnWindowFocus: false, // Avoid unnecessary fetches on window focus
  });
};
