import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/adminDashboard"]; // Specify protected routes here

export default async function middleware(request: NextRequest) {
  // Retrieve the token from the request
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });

  // Check if the current path is protected
  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Redirect to the login page if trying to access a protected route without a token
  if (!token && isProtected) {
    const loginUrl = new URL("/", request.nextUrl.origin); // Replace "/" with your actual login path if different
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to proceed if token exists or route is not protected
  return NextResponse.next();
}

// Configure matcher for protected routes
export const config = {
  matcher: ["/adminDashboard", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
