import { auth } from "./auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/panel');

  if (isDashboardRoute && !isLoggedIn) {
    return Response.redirect(new URL('/', req.nextUrl));
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
}
