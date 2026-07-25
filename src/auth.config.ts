import type { NextAuthConfig } from "next-auth";

// Edge-safe config (no Prisma/bcrypt): consumed by middleware.ts for route
// protection. The Credentials provider itself lives in auth.ts, which runs
// only in the Node.js runtime (route handlers, server actions, pages).
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const isOnAdmin =
        nextUrl.pathname.startsWith("/admin") &&
        nextUrl.pathname !== "/admin/login";

      if (isOnAdmin) {
        return isLoggedIn;
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
