import OpenAI from 'openai';

export interface OpenAIConfig {
  apiKey: string;
  model: string;
}

export const defaultOpenAIConfig: OpenAIConfig = {
  apiKey: '',
  model: 'gpt-4o'
};

/**
 * Generate content using OpenAI
 */
export async function generateWithOpenAI(prompt: string, config: OpenAIConfig): Promise<string> {
  if (!config.apiKey) {
    throw new Error("OpenAI API key is required to generate content.");
  }

  const openai = new OpenAI({
    apiKey: config.apiKey,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: config.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    if (!completion.choices || completion.choices.length === 0) {
      throw new Error("No response from OpenAI.");
    }

    const content = completion.choices[0].message.content;

    if (!content) {
      throw new Error("No content in OpenAI response.");
    }

    return content;
  } catch (error) {
    console.error("Error generating with OpenAI:", error);
    throw error;
  }
}

export { defaultOpenAIConfig, OpenAIConfig, generateWithOpenAI };
