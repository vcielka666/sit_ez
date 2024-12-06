import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET() {
  try {
    const place = await prisma.place.findMany({
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        description: true, // Include description
        pictureUrls: true, // Updated to fetch `pictureUrls` (array)
        tables: {
          select: {
            id: true,
            tableNumber: true,
            freeSeats: true,
            totalSeats: true,
            seats: true,
          },
        },
      },
    });

    // Filter tables to include only those with all seats free
    const placesWithFilteredTables = place.map((place) => {
      const fullyFreeTables = place.tables.filter(
        (table) => table.freeSeats === table.totalSeats
      );

      return {
        id: place.id,
        name: place.name,
        latitude: place.latitude,
        longitude: place.longitude,
        description: place.description, // Include description
        pictureUrls: place.pictureUrls, // Updated to return the array of picture URLs
        freeTables: fullyFreeTables.map((table) => ({
          id: table.id,
          tableNumber: table.tableNumber,
          totalSeats: table.totalSeats,
        })),
      };
    });

    return NextResponse.json(placesWithFilteredTables, { status: 200 });
  } catch (error: any) {
    console.error("Error in /api/public/getPlace:", error.message || error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
