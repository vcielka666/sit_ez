import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "../../../lib/prisma";

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract `placeId` from the request URL
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get("placeId");

  if (!placeId) {
    return NextResponse.json({ error: "Missing placeId" }, { status: 400 });
  }

  try {
    // Find the place by ID and check if it belongs to the user
    const place = await prisma.place.findUnique({
      where: { id: placeId },
    });

    if (!place) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    // Verify that the logged-in user owns the place
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (place.userId !== user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the place
    await prisma.place.delete({
      where: { id: placeId },
    });

    return NextResponse.json({ message: "Place deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting place:", error);
    return NextResponse.json({ error: "Error deleting place" }, { status: 500 });
  }
}
