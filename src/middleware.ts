import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  let token;

  try {
    token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET , secureCookie: true });
    console.log("Middleware Token:", token); // Debugging
  } catch (error) {
    console.error("Error retrieving token:", error);
  }

  if (token) {
    console.log("User authenticated");
  } else {
    console.log("No token found, redirecting to signin");
  }

  if (
    token &&
    (url.pathname.startsWith("/signin") ||
      url.pathname.startsWith("/signup") ||
      url.pathname.startsWith("/verify") ||
      url.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}
