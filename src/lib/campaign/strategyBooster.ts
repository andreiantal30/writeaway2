
import { OpenAIConfig, generateWithOpenAI } from '../openai';
import { CampaignInput, GeneratedCampaign } from '../../types/campaign';
import { extractJsonFromResponse } from '../../utils/formatters';

/**
 * Apply strategy booster to enhance campaign strategy
 * Makes the strategy more distinctive and culturally relevant
 */
export async function applyStrategyBooster(
  campaign: Partial<GeneratedCampaign>,
  input: CampaignInput,
  config: OpenAIConfig
): Promise<Partial<GeneratedCampaign>> {
  if (!campaign.strategy) {
    console.log("Strategy booster skipped (no strategy present)");
    return campaign;
  }
  
  try {
    const prompt = `
You are a strategic planner at a top creative agency. Enhance this campaign strategy to make it more distinctive, culturally relevant, and specific.

Brand: ${input.brand}
Industry: ${input.industry}
Current Strategy: "${campaign.strategy}"

Add the following elements to the strategy:
1. A clear tension or cultural insight
2. A specific behavioral change you're trying to create
3. A distinctive positioning angle that only this brand could own
4. A connection to current cultural context (2025)

Return ONLY the improved strategy as plain text, no explanations or commentary.
Make it concise (1-3 sentences) but powerful.
`;

    const response = await generateWithOpenAI(prompt, config);
    
    if (response && response.trim()) {
      // Replace the strategy with the enhanced version
      campaign.strategy = response.trim();
      console.log("Strategy booster applied");
    }
    
    return campaign;
  } catch (error) {
    console.error("Error applying strategy booster:", error);
    return campaign; // Return original campaign if enhancement fails
  }
}
