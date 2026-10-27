import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/jwt";

/**
 * Under-development gate. While on, every public page shows
 * /under-development instead of the real site. The client can still see the
 * real site by opening any URL once with `?preview=<PREVIEW_KEY>` — that sets
 * a cookie so the rest of their visit works normally.
 *
 * Turn the gate off at launch by setting MAINTENANCE_MODE=off on Vercel.
 */
const MAINTENANCE_ON = process.env.MAINTENANCE_MODE !== "off";
const PREVIEW_KEY = process.env.PREVIEW_KEY || "radhe-preview-2026";
const PREVIEW_COOKIE = "site_preview";
const UNDER_DEV_PATH = "/under-development/";

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  if (pathname.startsWith("/admin")) return adminGuard(req);

  if (!MAINTENANCE_ON || pathname.startsWith("/under-development")) {
    return NextResponse.next();
  }

  // Preview link: remember the client and strip the key from the URL.
  if (searchParams.get("preview") === PREVIEW_KEY) {
    const url = req.nextUrl.clone();
    url.searchParams.delete("preview");
    const res = NextResponse.redirect(url);
    res.cookies.set(PREVIEW_COOKIE, PREVIEW_KEY, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return res;
  }

  if (req.cookies.get(PREVIEW_COOKIE)?.value === PREVIEW_KEY) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = UNDER_DEV_PATH;
  url.search = "";
  const res = NextResponse.rewrite(url);
  // Keep search engines from indexing the placeholder.
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

/**
 * Protects every /admin route except the login page. Unauthenticated
 * visitors are redirected to /admin/login (with a `from` return path).
 */
async function adminGuard(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the login page and its POST action through.
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Everything except API routes, Next internals and static files.
  matcher: ["/((?!api|_next/static|_next/image|images|favicon|.*\\.[\\w]+$).*)"],
};
