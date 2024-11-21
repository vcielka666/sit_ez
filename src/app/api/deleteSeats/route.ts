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
    const table = await prisma.table.findUnique({ where: { id: tableId } });

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    if (table.freeSeats <= 0) {
      return NextResponse.json({ error: "No free seats to remove" }, { status: 400 });
    }

    const updatedTable = await prisma.table.update({
      where: { id: tableId },
      data: { freeSeats: table.freeSeats - 1 },
    });

    return NextResponse.json(updatedTable, { status: 200 });
  } catch (error) {
    console.error("Error removing free seat:", error);
    return NextResponse.json({ error: "Error removing free seat" }, { status: 500 });
  }
}
