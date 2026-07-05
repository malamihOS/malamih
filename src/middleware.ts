import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/i18n/config";
import { canAccessPath, isAdminRole } from "@/lib/permissions";

const SESSION_COOKIE = "malamih_admin_session";

function getSecret() {
  return new TextEncoder().encode(
    process.env.SESSION_SECRET ?? "development-secret-change-me-in-production",
  );
}

async function getAdminSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const role = payload.role as string;
    return {
      authenticated: true,
      role: isAdminRole(role) ? role : ("admin" as const),
    };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const isLogin = pathname === "/admin/login";
    const session = await getAdminSession(request);

    if (!session && !isLogin) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session && isLogin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (session && !isLogin && !canAccessPath(session.role, pathname)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  const response = NextResponse.next();
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;

  if (cookieLocale && isLocale(cookieLocale)) {
    response.cookies.set(LOCALE_COOKIE, cookieLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  } else if (!cookieLocale) {
    response.cookies.set(LOCALE_COOKIE, defaultLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
