import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { organizationId } = auth();
    if (!organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const approvals = await prisma.approvalRequest.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(approvals);
  } catch (error) {
    console.error("Error fetching approvals:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
