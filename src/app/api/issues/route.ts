import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth"

const prisma = new PrismaClient();

const createIssueSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(10),

});

export async function POST(req: NextRequest) {
    let body;
    try {
      body = await req.json();
      if (!body || Object.keys(body).length === 0) {
        console.log("Request body is empty");
        throw new Error("Request body is empty");
      }
    } catch (error) {
      console.error("Invalid or empty payload:", error);
      return NextResponse.json({ error: "Invalid or empty payload" }, { status: 400 });
    }
  
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const email = session.user.email;  // Get email from session (assuming email is available)
    console.log("User email from session:", email);
  
    // Validate only the title and description
    const validation = createIssueSchema.safeParse(body);
  
    if (!validation.success) {
      console.log("Validation failed:", validation.error.errors);
      return NextResponse.json(validation.error.errors, { status: 400 });
    }
  
    try {
        console.log(email);
      const user = await prisma.user.findUnique({
        where: { email: email },  
      });
  
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      const userId = user.id;  // Now you have the userId from the users table
  
      // Create the issue with the userId fetched from the users table
      const newIssue = await prisma.issue.create({
        data: {
          title: body.title,
          description: body.description,
          userId: userId, // Use the userId from the users table
        },
      });
      
      console.log(newIssue);
  
      return NextResponse.json({
        newIssue,
      }, {
        status: 201,
      });
    } catch (error) {
      console.error("Error creating issue:", error);
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
