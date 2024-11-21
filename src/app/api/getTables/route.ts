import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "../../../lib/prisma";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const placeId = request.nextUrl.searchParams.get("placeId");

    if (!placeId) {
      return NextResponse.json({ error: "Place ID is required" }, { status: 400 });
    }

    // Convert placeId to a string-compatible format for Prisma
    const convertedPlaceId = new ObjectId(placeId).toString();

    const tables = await prisma.table.findMany({
      where: { placeId: convertedPlaceId },
      select: {
        id: true,
        tableNumber: true,
        totalSeats: true,
        freeSeats: true,
        seats: {
          select: {
            seatNumber: true,
          },
        },
      },
    });

    if (!tables || tables.length === 0) {
      return NextResponse.json([], { status: 200 }); // Ensure an empty array is returned
    }
    

    return NextResponse.json(tables, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching tables:", error.message || error);
    console.error("Stack trace:", error.stack || "No stack trace available");

    return NextResponse.json(
      { error: "Error fetching tables", details: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
