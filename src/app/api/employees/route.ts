import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId, organizationId } = auth();
    if (!userId || !organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, role, systemPrompt } = body;

    if (!name || !role || !systemPrompt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const employee = await prisma.aIEmployee.create({
      data: {
        name,
        role,
        systemPrompt,
        organizationId,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Error creating AI employee:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { organizationId } = auth();
    if (!organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employees = await prisma.aIEmployee.findMany({
      where: { organizationId },
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching AI employees:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
