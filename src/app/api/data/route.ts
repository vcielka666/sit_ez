// src/app/api/data/route.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // Use `getToken` directly to check for a session
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (token) {
    // If there's a valid token, return the session info
    return NextResponse.json(token);
  } else {
    // If not authenticated, return a 401 response
    return NextResponse.json({ message: "Not Authenticated" }, { status: 401 });
  }
}
