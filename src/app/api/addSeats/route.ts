// src/app/api/addSeats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "../../../lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tableId } = await request.json();

  if (!tableId) {
    return NextResponse.json({ error: "Table ID is required" }, { status: 400 });
  }

  try {
    const table = await prisma.table.findUnique({
      where: { id: tableId },
      include: { seats: true },
    });

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    const newSeat = await prisma.seat.create({
      data: {
        seatNumber: table.seats.length + 1,
        tableId,
      },
    });

    return NextResponse.json(newSeat, { status: 201 });
  } catch (error) {
    console.error("Error adding seat:", error);
    return NextResponse.json({ error: "Error adding seat" }, { status: 500 });
  }
}
