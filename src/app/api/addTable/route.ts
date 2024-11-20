// src/app/api/addTable/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { auth } from "../../../../auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { placeId, tableCount, seatsPerTable } = await request.json();

  if (!placeId || !tableCount || seatsPerTable == null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const createdTables = [];
    for (let i = 0; i < tableCount; i++) {
      const newTable = await prisma.table.create({
        data: {
          tableNumber: i + 1, // Adjust this logic if needed
          placeId,
        },
      });

      const seats = [];
      for (let j = 0; j < seatsPerTable; j++) {
        const seat = await prisma.seat.create({
          data: {
            seatNumber: j + 1,
            tableId: newTable.id,
          },
        });
        seats.push(seat);
      }

      createdTables.push({ ...newTable, seats });
    }

    return NextResponse.json(createdTables, { status: 201 });
  } catch (error) {
    console.error("Error adding tables:", error);
    return NextResponse.json({ error: "Error adding tables" }, { status: 500 });
  }
}
