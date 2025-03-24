import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  let token;

  try {
    token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: request.headers.get("x-forwarded-proto") === "https", // Only secure on production
    });
  } catch (error) {
    console.error("Error retrieving token:", error);
  }

  console.log("Middleware Token:", token); // Debugging

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

export const config = {
  matcher: ["/signin", "/signup", "/verify", "/", "/dashboard/:path*"],
  runtime: "nodejs", // Ensures compatibility with server functions
};
