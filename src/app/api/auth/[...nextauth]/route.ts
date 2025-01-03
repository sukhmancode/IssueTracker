import NextAuth, { NextAuthOptions, Session, Account, Profile, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add id here
      name?: string | null;
      email?: string ;
      image?: string | null;
    };
  }

  interface User {
    id: string; // Add id here
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}


export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET ?? "secret",
  callbacks: {
    async signIn(params: { user: User; account: Account | null; profile?: Profile }) {
      console.log("Sign-in params:", params);

      if (!params.user || !params.user.email) {
        return false;
      }
      try {
        await prisma.user.upsert({
          where: { email: params.user.email },
          update: {},
          create: {
            email: params.user.email || "unknown@email",
            provider: "Github",
            username: params.user.name || "Anonymous",
          },
        });
      } catch (e) {
        console.error("Error during sign-in:", e);
        return false;
      }
      return true;
    },
    async session({ session, token }: { session: Session; token: any }) {
      if (token && token.sub && session.user) {
        session.user.id = token.sub;
      }
      console.log("Session callback:", session);
      console.log(token);

      return session;
    },
  },
};

// Export named handlers for each HTTP method
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
