// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    role: string;
  }
}
