import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "../../../lib/prisma";


export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        places: {
          select: {
            id: true,
            name: true,
            latitude: true,
            longitude: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const places = user.places.map((place) => ({
      ...place,
      latitude: place.latitude ?? 0,  // Provide a fallback value
      longitude: place.longitude ?? 0, // Provide a fallback value
    }));

    return NextResponse.json(places, { status: 200 });
  } catch (error: any) {
    console.error("Error in /api/getPlace:", error.message || error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
