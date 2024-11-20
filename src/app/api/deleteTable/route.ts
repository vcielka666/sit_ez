// src/app/api/deleteTable/route.ts

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
    // Delete the table and cascading delete seats
    await prisma.table.delete({
      where: { id: tableId },
    });

    return NextResponse.json({ message: "Table deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting table:", error);
    return NextResponse.json({ error: "Error deleting table" }, { status: 500 });
  }
}
