import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET() {
  try {
    const places = await prisma.place.findMany({
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        tables: {
          select: {
            freeSeats: true,
          },
        },
      },
    });

    // Add logic to calculate total free seats and tables
    const placesWithFreeSeats = places.map((place) => {
      const totalFreeSeats = place.tables.reduce((sum, table) => sum + table.freeSeats, 0);
      const totalTables = place.tables.length;

      return {
        id: place.id,
        name: place.name,
        latitude: place.latitude,
        longitude: place.longitude,
        totalFreeSeats,
        totalTables,
      };
    });

    return NextResponse.json(placesWithFreeSeats, { status: 200 });
  } catch (error: any) {
    console.error("Error in /api/public/getPlaces:", error.message || error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
