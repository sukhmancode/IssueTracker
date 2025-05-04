"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Issue {
  id: string;
  title: string;
  description: string;
  user: {
    username: string;
  };
}

const Issues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get("/api/issues");
        setIssues(response.data.issues);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch issues.");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchIssues();
    } else {
      setLoading(false);
    }
  }, [status]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (status !== "authenticated") {
    return <div><p>You must be logged in to view issues.</p></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const name = session?.user?.name || "User";

  return (
    <main className="w-full flex p-20 gap-10 flex-col">
      <Button className="w-fit">
        <Link href="/issues/new">New Issue</Link>
      </Button>
      <h1 className="text-5xl font-bold">Welcome, {name}</h1>

      <section aria-label="Issues List">
        {issues.length > 0 ? (
          <ul className="space-y-4">
            {issues.map((issue) => (
              <li key={issue.id} className="p-4 border rounded shadow">
                <h2 className="text-xl font-semibold">{issue.title}</h2>
                <p className="text-gray-700">{issue.description}</p>
                <p className="text-sm text-gray-500">
                  Submitted by: {issue.user.username}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No issues found.</p>
        )}
      </section>
    </main>
  );
};

export default Issues;
