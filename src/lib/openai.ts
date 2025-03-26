
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

// New function to evaluate a generated campaign
export async function evaluateCampaign(
  campaign: any,
  config: OpenAIConfig = defaultOpenAIConfig
): Promise<string> {
  if (!config.apiKey) {
    throw new Error("OpenAI API key is not provided");
  }

  // Convert campaign to formatted string representation
  const campaignString = `
Campaign Name: ${campaign.campaignName}
Key Message: ${campaign.keyMessage}
Creative Strategy: ${Array.isArray(campaign.creativeStrategy) ? campaign.creativeStrategy.join(', ') : campaign.creativeStrategy}
Execution Plan: ${Array.isArray(campaign.executionPlan) ? campaign.executionPlan.join(', ') : campaign.executionPlan}
Viral Hook: ${campaign.viralHook || 'N/A'}
Consumer Interaction: ${campaign.consumerInteraction || 'N/A'}
Expected Outcomes: ${Array.isArray(campaign.expectedOutcomes) ? campaign.expectedOutcomes.join(', ') : campaign.expectedOutcomes}
Viral Element: ${campaign.viralElement || 'N/A'}
Call to Action: ${campaign.callToAction || 'N/A'}
  `;

  const prompt = `
# Creative Director Review

As a seasoned creative director at a top agency, critique this campaign concept with an honest, unbiased assessment. Score each dimension on a scale of 1-10 and provide brief justification for each score.

## Campaign to Evaluate:
${campaignString}

## Evaluation Framework:
1. Insight Quality: Is the insight emotionally sharp or culturally relevant? (Score 1–10)
2. Core Idea: Is the core idea surprising or original? (Score 1–10)
3. Behavior Impact: Does the execution shift behavior, thinking, or culture? (Score 1–10)
4. Award Potential: Would this stand out at an award jury table? Why or why not?

## Response Format:
For each dimension, provide:
- Score (1-10)
- Brief explanation of score (1-2 sentences)
- Quick suggestion for improvement

End with a one-line verdict summarizing your overall assessment of the campaign's creative quality.

Your assessment:
  `;

  try {
    return await generateWithOpenAI(prompt, config);
  } catch (error) {
    console.error("Error evaluating campaign:", error);
    throw error;
  }
}

