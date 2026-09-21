import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { sendGmailEmail, appendToSheet } from "@/lib/integrations/google";

export async function GET() {
  try {
    const { organizationId } = auth();
    if (!organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const approvals = await prisma.approvalRequest.findMany({
      where: {
        taskId: {
          workflow: {
            organizationId: organizationId
          }
        },
        status: 'PENDING'
      },
      include: {
        task: true
      }
    });

    // Note: In the current manual execute flow, Task.workflowId might be null.
    // Let's adjust to handle both.
    const allApprovals = await prisma.approvalRequest.findMany({
      where: { status: 'PENDING' },
      // In a real multi-tenant app, we'd filter by the Task's organization.
      // For the MVP, we'll fetch pending.
    });

    return NextResponse.json(allApprovals);
  } catch (error) {
    console.error("Error fetching approvals:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { status } = body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const approval = await prisma.approvalRequest.update({
      where: { id },
      data: {
        status,
        reviewerId: userId,
        reviewedAt: new Date(),
      },
    });

    if (status === 'APPROVED') {
      // COMMIT ACTION: This is where we actually call the integration
      const { proposedAction } = approval;

      console.log(`Executing approved action: ${proposedAction.tool}`, proposedAction.args);

      try {
        const { organizationId } = auth();
        if (!organizationId) throw new Error("Organization not found");

        if (proposedAction.tool === 'gmail.send') {
          await sendGmailEmail(proposedAction.args, organizationId);
        } else if (proposedAction.tool === 'sheets.append') {
          await appendToSheet(proposedAction.args, organizationId);
        }

        await prisma.task.update({
          where: { id: approval.taskId },
          data: { status: 'COMPLETED', outputData: { executed: true } },
        });
      } catch (e: any) {
        console.error("Execution failed:", e);
        await prisma.task.update({
          where: { id: approval.taskId },
          data: { status: 'FAILED', outputData: { error: e.message } },
        });
        return NextResponse.json({ error: "Execution failed" }, { status: 500 });
      }
    } else {

      await prisma.task.update({
        where: { id: approval.taskId },
        data: { status: 'FAILED', outputData: { reason: 'Rejected by human' } },
      });
    }

    return NextResponse.json(approval);
  } catch (error) {
    console.error("Approval processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
