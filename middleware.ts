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

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Retrieve auth token from cookies (supports standard token or animagent_token)
  const tokenFromCookie =
    request.cookies.get("token")?.value ||
    request.cookies.get("animagent_token")?.value;

  // Support incoming OAuth token callback query param if landing on a protected route directly
  const tokenFromQuery = searchParams.get("token");

  const isAuthenticated = Boolean(
    (tokenFromCookie && tokenFromCookie.trim().length > 0) ||
    (tokenFromQuery && tokenFromQuery.trim().length > 0)
  );

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
    return NextResponse.redirect(loginUrl);
  }

  // Case 2: Authenticated user attempting to visit login/register -> redirect to /workspace
  if (isAuthRoute && isAuthenticated && !searchParams.get("logout")) {
    return NextResponse.redirect(new URL("/workspace", request.url));
  }

  // Allow request to proceed
  const response = NextResponse.next();

  // If token was present in URL query (e.g. OAuth callback), seed the cookie on the response
  if (tokenFromQuery && !tokenFromCookie) {
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
