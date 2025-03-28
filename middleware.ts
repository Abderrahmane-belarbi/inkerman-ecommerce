import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { auth: middleware } = NextAuth(authConfig);
/* 
  Middleware runs before a request is processed.
  If a user is authenticated, they can proceed.
  If they are not authenticated, they are redirected to the sign-in page.
*/
export const config = {
  matcher: [
    /*
      Protects all routes except:
      1- API routes (/api/...) → API endpoints remain public.
      2- Static files (/_next/static/...) → Next.js build files remain public.
      3- Image optimization (/_next/image/...) → Next.js optimized images remain public.
      4- Favicon (/favicon.ico) → The website icon remains public.
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
