import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function middleware(req: NextRequest) {
  const reqUrl = new URL(req.url);
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const isLoginPage = ["/login", "/registro", "forgot-password"].includes(
    reqUrl.pathname
  );
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (isLoginPage && session) {
    return NextResponse.redirect(reqUrl.host);
  } else if (!session && !isLoginPage) {
    return NextResponse.redirect("/login");
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|images|icons|_next/static|_next/image|favicon.ico).*)"],
};
