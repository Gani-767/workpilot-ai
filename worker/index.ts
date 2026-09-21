import { Worker, Queue, QueueEvents } from 'bullmq';
import { prisma } from './src/lib/prisma/client';
import { executeAIEmployeeTask } from './src/lib/ai/runtime';

const REDIS_CONFIG = {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
};

const workflowQueue = new Queue('workflow-queue', REDIS_CONFIG);

async function processWorkflow() {
  console.log('Checking for due workflows...');

  // 1. Find workflows that are due based on their cron schedule
  // In a production app, we'd use a proper cron library or BullMQ's repeatable jobs.
  // For the MVP, we simulate the scheduler.
  const dueWorkflows = await prisma.workflow.findMany({
    where: { status: 'ENABLED' }
  });

  for (const workflow of dueWorkflows) {
    console.log(`Triggering workflow: ${workflow.name}`);

    // 2. Create a Task record
    const task = await prisma.task.create({
      data: {
        workflowId: workflow.id,
        status: 'RUNNING',
        inputData: { goal: 'Execute the scheduled recurring task' },
        outputData: {},
      }
    });

    // 3. Add to BullMQ for asynchronous execution
    await workflowQueue.add('execute-task', {
      taskId: task.id,
      employeeId: workflow.aiEmployeeId,
      input: `Perform the following recurring task: ${workflow.name}. Goal: ${workflow.description || 'Standard execution'}`
    });
  }
}

const worker = new Worker('workflow-queue', async job => {
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
  } catch (error) {
    console.error(`Task ${taskId} failed:`, error);
    await prisma.task.update({
      where: { id: taskId },
      data: { status: 'FAILED', outputData: { error: error.message } }
    });
  }
}, REDIS_CONFIG);

// Simple polling interval for the MVP scheduler
setInterval(processWorkflow, 60000); // Check every minute

console.log('WorkPilot AI Scheduler Worker started...');
