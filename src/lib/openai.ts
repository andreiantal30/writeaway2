
// OpenAI API client for generating creative campaigns
import { toast } from "sonner";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export interface OpenAIConfig {
  apiKey: string;
  model: string;
}

// Default configuration with embedded API key
export const defaultOpenAIConfig: OpenAIConfig = {
  apiKey: "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",
  model: "gpt-4o",
};

export async function generateWithOpenAI(
  prompt: string,
  config: OpenAIConfig = defaultOpenAIConfig
): Promise<string> {
  if (!config.apiKey) {
    throw new Error("OpenAI API key is not provided");
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Error generating content with OpenAI");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}
