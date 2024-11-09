import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("SitEzSession");

  if (!adminCookie) {
    return NextResponse.json({ isAdmin: false });
  }

  try {
    const { payload } = await jwtVerify(
      adminCookie.value,
      new TextEncoder().encode(process.env.SESSION_SECRET)
    );

    const isAdmin = payload.isAdmin === true;
    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ isAdmin: false });
  }
}
