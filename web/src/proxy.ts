import { type NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/auth/constants";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE);

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/events/new",
    "/events/:eventId/edit",
    "/profile",
    "/profile/:path*",
  ],
};
