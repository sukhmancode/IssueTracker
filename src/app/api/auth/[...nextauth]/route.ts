import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID ?? "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET ?? "secret",
    callbacks: {
        async signIn(params: any) {
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
        //@ts-ignore
        async session({ session, token }) {
            if (token && token.sub) {
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
