import { NextResponse } from "next/server";
import { executeAIEmployeeTask } from "@/lib/ai/runtime";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId, organizationId } = auth();
    if (!userId || !organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { employeeId, input } = body;

    if (!employeeId || !input) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await executeAIEmployeeTask(employeeId, input);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Execution Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
