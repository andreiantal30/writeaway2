
import { OpenAIConfig, generateWithOpenAI } from '../openai';
import { CampaignInput, GeneratedCampaign } from './types';

/**
 * Add narrative anchor to the campaign content
 * Provides a unifying storytelling thread through the campaign
 */
export async function addNarrativeAnchor(
  campaign: Partial<GeneratedCampaign>,
  input: CampaignInput,
  config: OpenAIConfig
): Promise<Partial<GeneratedCampaign>> {
  try {
    // Only proceed if we have the necessary elements
    if (!campaign.campaignName || !campaign.strategy) {
      console.log("Narrative anchor skipped (missing required elements)");
      return campaign;
    }
    
    const prompt = `
You are a master storyteller working on a campaign for ${input.brand} in the ${input.industry} industry.

Campaign Name: ${campaign.campaignName}
Strategy: ${campaign.strategy}
Target Audience: ${input.targetAudience.join(', ')}
Emotional Appeal: ${input.emotionalAppeal.join(', ')}

Create a powerful narrative anchor for this campaign - a unifying storytelling thread that ties all executions together.
This should be a compelling, emotionally resonant story element that connects with the audience on a human level and functions as a "red thread" through all campaign touchpoints.

Return ONLY the narrative anchor as plain text, no explanations or commentary.
Make it under 100 words.
`;

    const response = await generateWithOpenAI(prompt, config);
    
    if (response && response.trim()) {
      // Add the narrative anchor to the campaign
      if (!('narrativeAnchor' in campaign)) {
        campaign.narrativeAnchor = response.trim();
      } else {
        campaign.narrativeAnchor = response.trim();
      }
      
      console.log("Narrative anchor added");
    }
    
    return campaign;
  } catch (error) {
    console.error("Error adding narrative anchor:", error);
    return campaign; // Return original campaign if enhancement fails
  }
}
