
import OpenAI from 'openai';
import { getEnvVariable } from '../utils/envVariables';

/**
 * Creates and configures the OpenAI client instance
 * Only used on the server-side to ensure API key security
 */
export function createOpenAIClient(): OpenAI {
  const apiKey = getEnvVariable('OPENAI_API_KEY');
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please check your environment variables.');
  }
  
  return new OpenAI({
    apiKey,
    // Default to GPT-4o as the preferred model for high-quality content generation
    defaultQuery: {
      model: 'gpt-4o',
    },
  });
}
