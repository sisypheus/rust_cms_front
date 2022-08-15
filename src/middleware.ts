import { getSession } from "next-auth/react";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const url = req.nextUrl.clone();
  const requestForNextAuth = {
    headers: {
      cookie: req.headers.get("cookie"),
    },
  };

  // @ts-ignore
  const session = await getSession({ req: requestForNextAuth });

  if (session) {
    if (url.pathname === "/login") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  } else {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/add_post/:path*', '/dashboard/:path*'],
}
