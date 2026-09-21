import axios from 'axios';
import { TOOL_REGISTRY } from './index';

export async function performWebSearch(query: string) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error('TAVILY_API_KEY is not configured');
  }

  try {
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query: query,
      search_depth: 'smart',
      max_results: 5,
    });

    const results = response.data.results;
    if (!results || results.length === 0) {
      return "No relevant search results found.";
    }

    return results.map((r: any, i: number) =>
      `[${i+1}] ${r.title}: ${r.content}\nSource: ${r.url}`
    ).join('\n\n');

  } catch (error: any) {
    console.error('Web Search Error:', error.response?.data || error.message);
    throw new Error(`Search failed: ${error.message}`);
  }
}
