import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/signin";
      url.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    const role = token.role as string | undefined;
    const allowed = role === "SUPERADMIN" || role === "ADMIN" || role === "COACH";

    if (!allowed) {
      const url = req.nextUrl.clone();
      url.pathname = "/customer";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};