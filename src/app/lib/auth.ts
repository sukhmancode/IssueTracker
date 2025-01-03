import  { NextAuthOptions, Session, User, Account, Profile } from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { JWT } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string ;
            email: string ;
            image: string ;
        }
    }
}
interface SignInParams {
    user: User;
    account: Account | null;
    profile?: Profile;
    email?: {
        verificationRequest?: boolean;
    };
    credentials?: Record<string, any>;
}


const prisma = new PrismaClient();
export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID ?? "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET ?? "secret",
    callbacks: {
        async signIn({ user, account, profile }: SignInParams) {
            console.log("Sign-in params:", { user, account, profile });
            if (!user || !user.email) {
                return false;
            }
            try {
                await prisma.user.upsert({
                    where: { email: user.email },
                    update: {},
                    create: {
                        email: user.email || "unknown@email",
                        provider: "Github",
                        username: user.name || "Anonymous",
                    },
                });
            } catch (e) {
                console.error("Error during sign-in:", e);
                return false;
            }
            return true;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (token && token.sub) {
                session.user.id = token.sub;
            }
            console.log("Session callback:", session);
            console.log(token);
            
            return session;
        },
    },
};
