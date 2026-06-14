import { auth } from "./auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/panel');
  const isHomeRoute = req.nextUrl.pathname === '/';

  if (isDashboardRoute && !isLoggedIn) {
    return Response.redirect(new URL('/', req.nextUrl));
  }

  if (isHomeRoute && isLoggedIn) {
    return Response.redirect(new URL('/panel', req.nextUrl));
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
}
