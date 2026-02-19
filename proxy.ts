import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const cookies = getSessionCookie(request);
  if (!cookies) {
    return NextResponse.redirect(new URL(process.env.NEXT_PUBLIC_LOGIN_URL || "/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [process.env.NEXT_PUBLIC_DASHBOARD_URL || "/dashboard"],
};
