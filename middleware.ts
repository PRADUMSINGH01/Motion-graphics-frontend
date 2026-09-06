import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Protected routes that require an authenticated user session.
 */
const PROTECTED_ROUTES = [
  "/workspace",
  "/billing",
  "/api-keys",
  "/data-usage",
];

/**
 * Authentication routes where already logged-in users should be redirected away.
 */
const AUTH_ROUTES = ["/login", "/register"];

function isValidToken(token?: string | null): boolean {
  if (!token) return false;
  const trimmed = token.trim();
  if (
    !trimmed ||
    trimmed === "undefined" ||
    trimmed === "null" ||
    trimmed === "deleted" ||
    trimmed === '""'
  ) {
    return false;
  }
  return trimmed.length > 3;
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Allow API routes to pass through freely (e.g. /api/auth/logout)
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Retrieve auth token from cookies (supports standard token or animagent_token)
  const tokenCookie = request.cookies.get("token")?.value;
  const animagentCookie = request.cookies.get("animagent_token")?.value;

  const validCookieToken = isValidToken(tokenCookie)
    ? tokenCookie
    : isValidToken(animagentCookie)
    ? animagentCookie
    : null;

  // Support incoming OAuth token callback query param if landing on a protected route directly
  const rawQueryToken = searchParams.get("token");
  const tokenFromQuery = isValidToken(rawQueryToken) ? rawQueryToken : null;

  const isAuthenticated = Boolean(validCookieToken || tokenFromQuery);

  // Check if current path matches any protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if current path is login or register
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Case 1: Unauthenticated access to protected pages -> redirect to /login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    // Purge any leftover or stale cookies across browsers
    response.cookies.delete("token");
    response.cookies.delete("animagent_token");
    response.cookies.set({
      name: "token",
      value: "",
      path: "/",
      expires: new Date(0),
      maxAge: 0,
    });
    response.cookies.set({
      name: "animagent_token",
      value: "",
      path: "/",
      expires: new Date(0),
      maxAge: 0,
    });
    return response;
  }

  // Case 2: Authenticated user attempting to visit login/register -> redirect to /workspace
  // Do NOT redirect if the user was explicitly directed to login (e.g. ?redirect=/workspace)
  if (isAuthRoute && isAuthenticated && !searchParams.get("logout") && !searchParams.get("redirect")) {
    return NextResponse.redirect(new URL("/workspace", request.url));
  }

  // Allow request to proceed
  const response = NextResponse.next();

  // If token was present in URL query (e.g. OAuth callback), seed the cookie on the response
  if (tokenFromQuery && !validCookieToken) {
    response.cookies.set({
      name: "token",
      value: tokenFromQuery,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.png, icon.svg (browser icons)
     * - static image/asset extensions
     */
    "/((?!_next/static|_next/image|favicon\\.ico|icon\\.png|icon\\.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2)$).*)",
  ],
};
