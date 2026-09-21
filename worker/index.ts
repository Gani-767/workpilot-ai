import { Worker, Queue } from 'bullmq';
import { prisma } from '../src/lib/prisma/client';
import { executeAIEmployeeTask } from '../src/lib/ai/runtime';

const REDIS_CONFIG = {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
};

const workflowQueue = new Queue('workflow-queue', REDIS_CONFIG);

async function processWorkflow() {
  console.log('Checking for due workflows...');

  const dueWorkflows = await prisma.workflow.findMany({
    where: { status: 'ENABLED' }
  });

  for (const workflow of dueWorkflows) {
    console.log(`Triggering workflow: ${workflow.name}`);

    const task = await prisma.task.create({
      data: {
        workflowId: workflow.id,
        status: 'RUNNING',
        inputData: { goal: 'Execute the scheduled recurring task' },
        outputData: {},
      }
    });

    await workflowQueue.add('execute-task', {
      taskId: task.id,
      employeeId: workflow.aiEmployeeId,
      input: `Perform the following recurring task: ${workflow.name}. Goal: ${workflow.description || 'Standard execution'}`
    });
  }
}

const worker = new Worker('workflow-queue', async (job) => {
  const { taskId, employeeId, input } = job.data;
  console.log(`Processing task ${taskId} for employee ${employeeId}`);

  try {
    const result = await executeAIEmployeeTask(employeeId, input, taskId);

    if (result.status === 'COMPLETED') {
      await prisma.task.update({
        where: { id: taskId },
        data: { status: 'COMPLETED', outputData: { result: result.output } }
      });
    } else if (result.status === 'AWAITING_APPROVAL') {
      await prisma.task.update({
        where: { id: taskId },
        data: { status: 'AWAITING_APPROVAL' }
      });
    }
  } catch (error: any) {
    console.error(`Task ${taskId} failed:`, error);
    await prisma.task.update({
      where: { id: taskId },
      data: { status: 'FAILED', outputData: { error: error.message } }
    });
  }
}, REDIS_CONFIG);

setInterval(processWorkflow, 60000);

console.log('WorkPilot AI Scheduler Worker started...');
