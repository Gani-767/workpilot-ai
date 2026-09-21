import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '@/lib/prisma/client';
import { TOOL_REGISTRY, isProtectedTool } from './tools';
import { performWebSearch } from './tools/web-search';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function executeAIEmployeeTask(
  employeeId: string,
  input: string,
  taskId?: string
) {
  const employee = await prisma.aIEmployee.findUnique({
    where: { id: employeeId },
  });

  if (!employee) {
    throw new Error('AI Employee not found');
  }

  // 1. Initialize the conversation with the employee's system prompt
  const messages = [
    { role: 'user', content: input },
  ];

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 1024,
    system: employee.systemPrompt,
    messages: messages,
    tools: Object.values(TOOL_REGISTRY).map(t => ({
      name: t.name,
      description: t.description,
      input_schema: t.parameters,
    })),
  });

  // 2. Handle Tool Use
  if (response.stop_reason === 'tool_use') {
    const toolCall = response.content.find(c => c.type === 'tool_use');

    if (toolCall) {
      const { name, input: toolInput } = toolCall;

      if (isProtectedTool(name)) {
        // STAGE AND COMMIT PATTERN: Intercept and save as ApprovalRequest

        // Ensure we have a task record
        let currentTaskId = taskId;
        if (!currentTaskId) {
          // Create a generic task for a manual trigger
          currentTaskId = await prisma.task.create({
            data: {
              workflowId: null as any,
              status: 'AWAITING_APPROVAL',
              inputData: { originalInput: input },
              outputData: {},
            },
          }).id;
        }

        await prisma.approvalRequest.create({
          data: {
            taskId: currentTaskId,
            proposedAction: {
              tool: name,
              args: toolInput,
              aiResponse: response.content.filter(c => c.type === 'text').map(t => (t as any).text).join('\n'),
            },
            status: 'PENDING',
          },
        });

        return {
          status: 'AWAITING_APPROVAL',
          message: `The AI wants to use the ${name} tool. This requires human approval.`,
          taskId: currentTaskId,
        };
      } else {
        // Execute public tool immediately
        let toolResult;
        if (name === 'web.search') {
          toolResult = await performWebSearch(toolInput.query as string);
        } else {
          toolResult = `Successfully executed ${name}`;
        }

        // In a production loop, we would feed this result back to Claude for a final response.
        return {
          status: 'COMPLETED',
          output: toolResult,
        };
      }
    }
  }

  return {
    status: 'COMPLETED',
    output: response.content[0]?.type === 'text' ? (response.content[0] as any).text : 'No text response',
  };
}
