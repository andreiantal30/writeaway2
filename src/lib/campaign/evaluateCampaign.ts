
import { OpenAIConfig, generateWithOpenAI } from '../openai';
import { GeneratedCampaign } from './types';
import { extractJsonFromResponse } from '../../utils/formatters';

// Interface for feedback criterion
export interface FeedbackCriterion {
  score: number;
  comment: string;
}

// Interface for campaign evaluation
export interface CampaignEvaluation {
  insightSharpness: FeedbackCriterion;
  ideaOriginality: FeedbackCriterion;
  executionPotential: FeedbackCriterion;
  awardPotential: FeedbackCriterion;
  finalVerdict: string;
}

/**
 * Evaluate a generated campaign against standard creative metrics
 */
export async function evaluateCampaign(
  campaign: GeneratedCampaign,
  config: OpenAIConfig
): Promise<CampaignEvaluation> {
  try {
    const prompt = `
You are an experienced creative director at a top advertising agency. You've been asked to evaluate the following campaign proposal:

Campaign Name: ${campaign.campaignName}
Key Message: ${campaign.keyMessage || 'N/A'}
Creative Strategy: ${campaign.strategy}
Execution Plan: ${campaign.executionPlan.join(", ")}
Viral Element: ${campaign.viralElement}
Call to Action: ${campaign.callToAction}

Please evaluate this campaign on the following criteria, with a score from 1-10 and a brief comment for each:

1. Insight Sharpness: How unique, specific, and commercially relevant is the strategic insight behind the campaign?
2. Idea Originality: How fresh and unexpected is the creative approach? Is it truly distinct from existing campaigns?
3. Execution Potential: How well does the tactical execution plan deliver on the core idea? Is it implementable and resonant?
4. Award Potential: How likely is this campaign to win creative awards? Does it have breakthrough potential?

Then provide a 2-3 sentence final verdict on the overall strength of the proposal.

Format your response as JSON with the following structure:
\`\`\`json
{
  "insightSharpness": { "score": 8, "comment": "Your comment here" },
  "ideaOriginality": { "score": 7, "comment": "Your comment here" },
  "executionPotential": { "score": 9, "comment": "Your comment here" },
  "awardPotential": { "score": 6, "comment": "Your comment here" },
  "finalVerdict": "Your 2-3 sentence verdict here"
}
\`\`\`
`;

    const response = await generateWithOpenAI(prompt, config);
    const cleanedResponse = extractJsonFromResponse(response);
    
    try {
      const evaluation = JSON.parse(cleanedResponse);
      return evaluation;
    } catch (error) {
      console.error("Error parsing evaluation results:", error);
      // Return default evaluation if parsing fails
      return {
        insightSharpness: { score: 5, comment: "Unable to evaluate insight sharpness." },
        ideaOriginality: { score: 5, comment: "Unable to evaluate idea originality." },
        executionPotential: { score: 5, comment: "Unable to evaluate execution potential." },
        awardPotential: { score: 5, comment: "Unable to evaluate award potential." },
        finalVerdict: "Unable to provide a final verdict due to evaluation processing error."
      };
    }
  } catch (error) {
    console.error("Error evaluating campaign:", error);
    // Return default evaluation if API call fails
    return {
      insightSharpness: { score: 5, comment: "Unable to evaluate insight sharpness." },
      ideaOriginality: { score: 5, comment: "Unable to evaluate idea originality." },
      executionPotential: { score: 5, comment: "Unable to evaluate execution potential." },
      awardPotential: { score: 5, comment: "Unable to evaluate award potential." },
      finalVerdict: "Unable to provide a final verdict due to evaluation processing error."
    };
  }
}
