"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button"; // Assuming you're using your Button component

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/issues");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-4xl font-bold">Welcome to Issue Tracker</h1>
      <Button onClick={() => signIn()}>Sign In</Button>
    </div>
  );
}
