import type { NextAuthConfig } from "next-auth";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [],
  // Callbacks in NextAuth allow custom logic during authentication events.
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // The authorized callback controls route protection by checking whether a user is authenticated before allowing access.
    authorized({ request, auth }: any) {
      const protectedPaths = [
        // /checkout and its subpaths (e.g., /checkout/payment, /checkout/review) are protected.
        // /account and its subpaths (e.g., /account/settings, /account/orders) are protected.
        // /admin and all related routes (e.g., /admin/dashboard, /admin/users) are restricted.
        /\/checkout(\/.*)?/,
        /\/account(\/.*)?/,
        /\/admin(\/.*)?/,
      ];
      // request.nextUrl.pathname extracts the requested URL path (e.g., /checkout/payment).
      const { pathname } = request.nextUrl;
      // Checks if the current pathname matches any of the protected routes using regex.
      // The .some() method in JavaScript is an array method that checks if at least one element in 
      // an array meets a specific condition. It returns true if at least one element satisfies the 
      // condition and false otherwise.
      if (protectedPaths.some((p) => p.test(pathname))) return !!auth;
      return true;
    },
  },
} satisfies NextAuthConfig;
