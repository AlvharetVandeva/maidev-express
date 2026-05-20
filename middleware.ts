import { NextRequest, NextResponse } from "next/server";

import { getSessionFromRequest, redirectToRoleDashboard } from "@/lib/auth";
import { roleDashboardPath, roleProfilePath, type UserRole } from "@/lib/roles";

const roleRouteMap: Array<{ prefix: string; role: UserRole }> = [
  { prefix: "/admin", role: "admin" },
  { prefix: "/courier", role: "courier" },
  { prefix: "/customer", role: "customer" },
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSessionFromRequest(request);
  const protectedRoute =
    pathname === "/dashboard" ||
    pathname === "/profile" ||
    roleRouteMap.some(({ prefix }) => pathname.startsWith(prefix));

  if (!protectedRoute) {
    return NextResponse.next();
  }

  if (!session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL(roleDashboardPath[session.role], request.url));
  }

  if (pathname === "/profile") {
    return NextResponse.redirect(new URL(roleProfilePath[session.role], request.url));
  }

  const roleRoute = roleRouteMap.find(({ prefix }) => pathname.startsWith(prefix));
  if (roleRoute && roleRoute.role !== session.role) {
    return redirectToRoleDashboard(request, session.role);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/profile", "/admin/:path*", "/courier/:path*", "/customer/:path*"],
};
