import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/adminDashboard"];

export default async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });

  // Check if the route is in the protected list
  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!token && isProtected) {
    const loginUrl = new URL("/", request.nextUrl.origin);
    return NextResponse.redirect(loginUrl.toString());
  }

  return NextResponse.next();
}

// Set up matching patterns for routes that should be protected by middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
