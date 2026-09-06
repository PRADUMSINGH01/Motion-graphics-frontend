import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  
  // Expire all auth session cookies
  cookieStore.delete("token");
  cookieStore.delete("animagent_token");

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  // Explicitly set expired cookies in response headers for all browsers
  response.cookies.set({
    name: "token",
    value: "",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
    sameSite: "lax",
  });

  response.cookies.set({
    name: "animagent_token",
    value: "",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
    sameSite: "lax",
  });

  return response;
}

export async function GET(request: Request) {
  const cookieStore = await cookies();

  cookieStore.delete("token");
  cookieStore.delete("animagent_token");

  const url = new URL("/login?logout=true", request.url);
  const response = NextResponse.redirect(url);

  response.cookies.set({
    name: "token",
    value: "",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
    sameSite: "lax",
  });

  response.cookies.set({
    name: "animagent_token",
    value: "",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
    sameSite: "lax",
  });

  return response;
}

