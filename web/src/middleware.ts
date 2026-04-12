import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_ENTERPRISE_SESSION_COOKIE,
  AUTH_SESSION_COOKIE,
} from "@/lib/config/auth-constants";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/portail-entreprise")) {
    if (path === "/portail-entreprise/login" || path === "/portail-entreprise/inscription") {
      return NextResponse.next();
    }
    const hasEnt = request.cookies.get(AUTH_ENTERPRISE_SESSION_COOKIE)?.value === "1";
    if (!hasEnt) {
      const login = new URL("/portail-entreprise/login", request.url);
      login.searchParams.set("from", path);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  const hasUser = request.cookies.get(AUTH_SESSION_COOKIE)?.value === "1";
  if (!hasUser) {
    const login = new URL("/login", request.url);
    login.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/:path*",
    "/settings/:path*",
    "/devices/:path*",
    "/enterprise/:path*",
    "/portail-entreprise/:path*",
  ],
};
