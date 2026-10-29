import { NextResponse, type NextRequest } from "next/server";

/**
 * Route-level auth gate. Runs at the edge before any page code, so a signed-out visitor never
 * sees a flash of protected UI before the client-side check in AuthContext catches up.
 *
 * This only checks that a session cookie is present — the backend is the source of truth and
 * verifies the token on every API call. A forged cookie gets a user into the dashboard shell,
 * but every real request it makes still gets rejected by the API with 401. That split (edge =
 * UX gate, API = security boundary) is intentional for a cookie we set from client JS.
 */
const PROTECTED_PREFIXES = ["/dashboard", "/api-keys", "/billing"];
const SESSION_COOKIES = ["token", "animagent_token"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (!isProtected) return NextResponse.next();

  const hasSession = SESSION_COOKIES.some((name) => Boolean(request.cookies.get(name)?.value));
  if (hasSession) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/api-keys/:path*", "/billing/:path*"],
};
