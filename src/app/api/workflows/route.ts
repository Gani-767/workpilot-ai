import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { organizationId } = auth();
    if (!organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workflows = await prisma.workflow.findMany({
      where: { organizationId },
      include: { aiEmployee: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(workflows);
  } catch (error) {
    console.error("Error fetching workflows:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { organizationId } = auth();
    if (!organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, schedule, aiEmployeeId, goal } = body;

    if (!name || !schedule || !aiEmployeeId || !goal) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const workflow = await prisma.workflow.create({
      data: {
        name,
        description,
        schedule,
        aiEmployeeId,
        organizationId,
        // We store the 'goal' in a way that it can be passed to the AI runtime.
        // For now, we'll let the runtime handle it via inputData in the Task.
      },
    });

    // Note: We'd typically register this with BullMQ here.
    // Since the worker is a separate process, it will poll the DB or receive a redis event.

    return NextResponse.json(workflow);
  } catch (error) {
    console.error("Error creating workflow:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
