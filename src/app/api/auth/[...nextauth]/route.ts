import NextAuth from "next-auth";
import { authOptions } from "@/app/lib/auth";

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);