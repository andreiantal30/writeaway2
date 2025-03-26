
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
Output Evaluation Layer

Purpose: Run a second GPT pass to critique and polish.

Review the campaign idea below as a Cannes jury member.  
Evaluate it on three key dimensions:
1. Unexpected Truth - Does the campaign reveal something surprising but recognizable? (Score 1-10)
2. Disruptive Idea - Does the approach break category conventions? (Score 1-10)
3. Behavior-Shifting Execution - Will this actually change how people act? (Score 1-10)

For each dimension:
- Provide a score from 1-10
- Give a brief explanation for your score
- Suggest one specific way to improve this dimension

Campaign to review:
${campaignString}

Your evaluation:
  `;

  try {
    return await generateWithOpenAI(prompt, config);
  } catch (error) {
    console.error("Error evaluating campaign:", error);
    throw error;
  }
}
