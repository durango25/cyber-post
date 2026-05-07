import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { User } from "@/types/auth";

// Error class khusus agar pesan backend bisa diteruskan ke client
class LoginError extends CredentialsSignin {
  constructor(message: string) {
    super(message);
    // code diteruskan ke client via result.code — encode agar aman di URL
    this.code = encodeURIComponent(message);
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      token: string;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new LoginError('Mohon lengkapi email dan password !');
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const json = await res.json();
          if (res.ok) {
            if (json.success) {
              const { user, access_token } = json.data as {
                user: Omit<User, "token">;
                access_token: string;
              };

              return {
                id: String(user.id),
                name: user.name,
                email: user.email,
                token: access_token,
              };
            }
          }
          else {
            console.log(json);
            if (res.status === 422) {
              throw new LoginError(JSON.stringify(json.errors) || json.message || 'Validation Error !');
            }
            else if (res.status === 401) {
              throw new LoginError(json.message || 'Email / Password salah !');
            }
            else if (res.status === 403) {
              throw new LoginError(json.message || 'Authentication Error !');
            }
            else if (res.status === 404) {
              throw new LoginError(json.message || 'Akun tidak ditemukan !');
            }
            else {
              throw new LoginError(json.message || 'Login gagal !');
            }
          }

          // if (!res.ok) return null;

          // const json = await res.json();
          // const { user, access_token } = json.data as {
          //   user: Omit<User, "token">;
          //   access_token: string;
          // };

          // return {
          //   id: String(user.id),
          //   name: user.name,
          //   email: user.email,
          //   token: access_token,
          // };
        }
        catch (error) {
          if (error instanceof CredentialsSignin) throw error;
          if (error instanceof Error) {
            throw new LoginError(error.message || 'Login gagal !');
          }
          throw new LoginError('Login gagal !');
        }
        return null;
      },
    }),
  ],
  events: {
    async signOut(message) {
      // Panggil logout backend untuk menghapus token dari database
      const token = "token" in message
        ? (message.token as Record<string, unknown>)?.userToken as string | undefined
        : undefined;

      if (token) {
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/logout`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }
          );
        } catch {
          // Tetap lanjutkan signOut meskipun backend gagal dihubungi
        }
      }
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          userId: String(user.id),
          userName: user.name ?? "",
          userEmail: user.email ?? "",
          userToken: (user as unknown as { token: string }).token ?? "",
        };
      }
      return token;
    },
    async session({ session, token }) {
      const t = token as typeof token & {
        userId: string;
        userName: string;
        userEmail: string;
        userToken: string;
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (session as any).user = {
        id: t.userId,
        name: t.userName,
        email: t.userEmail,
        token: t.userToken,
      };
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});
