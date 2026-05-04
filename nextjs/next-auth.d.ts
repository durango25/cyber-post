import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      token?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    token?: string;
  }

  interface JWT {
    id?: string;
    apiToken?: string;
  }
}
