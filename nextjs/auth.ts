import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

// API_URL is used server-side (Docker: http://laravel:8000/api); NEXT_PUBLIC fallback for local dev
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(`${API_URL}/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const { user, token } = res.data;

          if (user && token) {
            return { id: String(user.id), name: user.name, email: user.email, token };
          }
        } catch {
          return null;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      const isProtected =
        pathname.startsWith("/dashboard") ||
        pathname === "/posts/new" ||
        /^\/posts\/[^/]+\/edit$/.test(pathname);

      if (isProtected && !isLoggedIn) return false; // redirect to signIn page
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.apiToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = (token.id as string) ?? "";
      session.user.token = token.apiToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: { strategy: "jwt" },
});
