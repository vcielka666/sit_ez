// src/app/api/addPlace/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "../../../lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const { name, latitude, longitude, description, pictureUrls } = data; // Accept `pictureUrls` as an array

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newPlace = await prisma.place.create({
      data: {
        name,
        latitude,
        longitude,
        description,
        pictureUrls: pictureUrls || [], // Default to an empty array if not provided
        userId: user.id,
      },
    });

    return NextResponse.json(newPlace, { status: 201 });
  } catch (error) {
    console.error("Error adding place:", error);
    return NextResponse.json({ error: "Error adding place" }, { status: 500 });
  }
}
