import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "../../../lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { places: true }, // Include places associated with the user
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.places, { status: 200 }); // Return places as JSON
  } catch (error) {
    console.error("Error fetching places:", error);
    return NextResponse.json({ error: "Error fetching places" }, { status: 500 });
  }
}
