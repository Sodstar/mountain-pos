// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  const userRole = token?.role as string | undefined;
  
  // Define protected routes
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard") || isAdminRoute;
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login") || 
                      request.nextUrl.pathname.startsWith("/register");
  
  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  // Redirect unauthenticated users to login
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  // Check for admin-only routes
  if (isAdminRoute && userRole !== 'admin') {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};