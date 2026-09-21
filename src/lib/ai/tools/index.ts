export type ToolDefinition = {
  name: string;
  description: string;
  parameters: Record<string, any>;
  requiresApproval: boolean;
};

export const TOOL_REGISTRY: Record<string, ToolDefinition> = {
  'gmail.send': {
    name: 'gmail.send',
    description: 'Sends an email to a recipient.',
    parameters: {
      to: { type: 'string', description: 'Recipient email address' },
      subject: { type: 'string', description: 'Email subject' },
      body: { type: 'string', description: 'Email body content' },
    },
    requiresApproval: true,
  },
  'sheets.append': {
    name: 'sheets.append',
    description: 'Appends a row of data to a Google Sheet.',
    parameters: {
      spreadsheetId: { type: 'string', description: 'ID of the spreadsheet' },
      range: { type: 'string', description: 'The range to append to (e.g., "Sheet1!A1")' },
      values: { type: 'array', description: 'The row values to append' },
    },
    requiresApproval: true,
  },
  'web.search': {
    name: 'web.search',
    description: 'Search the web for real-time information.',
    parameters: {
      query: { type: 'string', description: 'The search query' },
    },
    requiresApproval: false,
  },
};

export function isProtectedTool(toolName: string): boolean {
  const tool = TOOL_REGISTRY[toolName];
  return tool ? tool.requiresApproval : true; // Default to protected for safety
}
