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
    const table = await prisma.table.findUnique({ where: { id: tableId } });

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    if (table.freeSeats >= table.totalSeats) {
      return NextResponse.json({ error: "Cannot add more seats than total seats" }, { status: 400 });
    }

    const updatedTable = await prisma.table.update({
      where: { id: tableId },
      data: { freeSeats: table.freeSeats + 1 },
    });

    return NextResponse.json(updatedTable, { status: 200 });
  } catch (error) {
    console.error("Error adding free seat:", error);
    return NextResponse.json({ error: "Error adding free seat" }, { status: 500 });
  }
}
