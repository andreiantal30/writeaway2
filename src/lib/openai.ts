
// OpenAI API client for generating creative campaigns
import { toast } from "sonner";
import { CampaignEvaluation } from "./campaign/types";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const STORAGE_KEY = "openai_api_key";

export interface OpenAIConfig {
  apiKey: string;
  model: string;
}

// Default configuration
export const defaultOpenAIConfig: OpenAIConfig = {
  apiKey: localStorage.getItem(STORAGE_KEY) || "",
  model: "gpt-4o",
};

// Log the API key status (not the actual key)
console.log("OpenAI: API key from localStorage status:", localStorage.getItem(STORAGE_KEY) ? "Found" : "Not found");

export async function generateWithOpenAI(
  prompt: string,
  config: OpenAIConfig = defaultOpenAIConfig
): Promise<string> {
  const apiKey = config.apiKey || localStorage.getItem(STORAGE_KEY);
  
  if (!apiKey) {
    console.error("OpenAI: API key is missing");
    throw new Error("OpenAI API key is not provided");
  }

  console.log("OpenAI: Making API request with model:", config.model);
  
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
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
      console.error("OpenAI API error response:", error);
      throw new Error(error.error?.message || "Error generating content with OpenAI");
    }

    const data = await response.json();
    console.log("OpenAI: Received successful response");
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}

// Evaluate a generated campaign
export async function evaluateCampaign(
  campaign: any,
  config: OpenAIConfig = defaultOpenAIConfig
): Promise<CampaignEvaluation> {
  const apiKey = config.apiKey || localStorage.getItem(STORAGE_KEY);
  
  if (!apiKey) {
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
1. Insight Sharpness: Is the insight emotionally sharp or culturally relevant? (Score 1–10)
2. Originality of the Idea: Is the core idea surprising or original? (Score 1–10)
3. Execution Potential: How effectively can this be implemented across channels? (Score 1–10)
4. Award Potential: Would this stand out at an award jury table? Why or why not? (Score 1–10)

## Response Format:
You MUST respond with a valid JSON object with NO additional text using this exact structure:
{
  "insightSharpness": {
    "score": 7,
    "comment": "Brief comment on the insight's effectiveness"
  },
  "ideaOriginality": {
    "score": 8,
    "comment": "Brief comment on the idea's originality"
  },
  "executionPotential": {
    "score": 6,
    "comment": "Brief comment on execution feasibility"
  },
  "awardPotential": {
    "score": 7,
    "comment": "Brief comment on award potential"
  },
  "finalVerdict": "One-line summary of your overall assessment"
}

Make sure to provide a concise, honest assessment of the campaign from a professional creative director's perspective.
  `;

  try {
    const response = await generateWithOpenAI(prompt, {
      apiKey: apiKey,
      model: config.model
    });
    
    // Parse the JSON response
    try {
      return JSON.parse(response) as CampaignEvaluation;
    } catch (parseError) {
      console.error("Error parsing evaluation response:", parseError);
      // Create a default evaluation object if parsing fails
      return {
        insightSharpness: { score: 5, comment: "Could not evaluate insight sharpness." },
        ideaOriginality: { score: 5, comment: "Could not evaluate idea originality." },
        executionPotential: { score: 5, comment: "Could not evaluate execution potential." },
        awardPotential: { score: 5, comment: "Could not evaluate award potential." },
        finalVerdict: "Evaluation could not be processed correctly."
      };
    }
  } catch (error) {
    console.error("Error evaluating campaign:", error);
    throw error;
  }
}

// Helper function to save API key to localStorage
export function saveApiKeyToStorage(apiKey: string): void {
  localStorage.setItem(STORAGE_KEY, apiKey);
}

// Helper function to get API key from localStorage
export function getApiKeyFromStorage(): string {
  return localStorage.getItem(STORAGE_KEY) || "";
}
