"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
import { useEffect } from "react";

export const Redirect = () => {
    const Router = useRouter();
    const Session = useSession();
    useEffect(() => {
        if(Session.data?.user) {
            Router.push("/issues")
        }
    },[])
    return null;
}