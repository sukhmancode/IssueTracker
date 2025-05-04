import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth"

const prisma = new PrismaClient();

const createIssueSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(2),

});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validation = createIssueSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newIssue = await prisma.issue.create({
      data: {
        title: body.title,
        description: body.description,
        userId: user.id,
      },
    });

    return NextResponse.json({ newIssue }, { status: 201 });

  } catch (error) {
    console.error("Error in POST /api/issues:", error);
    return NextResponse.json({ error: "Failed to create issue" }, { status: 500 });
  }
}
  
export async function GET() {
  try {
    const issues = await prisma.issue.findMany({
      include: {
        user: true,
      },
    });
    return NextResponse.json({
      issues,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json({
      error: "Failed to fetch issues",
    }, { status: 500 });
  }
}
