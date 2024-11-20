// src/app/api/deleteSeats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "../../../lib/prisma";

export async function DELETE(request: NextRequest) {
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

    if (!table || table.seats.length === 0) {
      return NextResponse.json({ error: "No seats to delete" }, { status: 400 });
    }

    const lastSeat = table.seats[table.seats.length - 1];

    await prisma.seat.delete({
      where: { id: lastSeat.id },
    });

    return NextResponse.json({ message: "Seat deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting seat:", error);
    return NextResponse.json({ error: "Error deleting seat" }, { status: 500 });
  }
}
