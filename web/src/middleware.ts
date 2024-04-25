import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(loginUrl, {
      headers: {
        "Set-Cookie": `redirectTo=${request.url}; Path=/; HttpOnly; max-age=20;`,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
