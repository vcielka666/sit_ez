import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import type { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const { username } = await req.json();
  const isAdmin = username === "admin";

  // Log to confirm request data
  console.log("Received username:", username);

  // Create JWT with isAdmin flag
  const token = await new SignJWT({ isAdmin })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("2h")
    .sign(new TextEncoder().encode(process.env.SESSION_SECRET));

  console.log("Generated Token:", token);

  // Create response and set cookie
  const response = NextResponse.json({ message: "Login successful" });
  response.cookies.set("SitEzSession", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  console.log("Setting cookie:", response.cookies.get("SitEzSession"));
  return response;
};
