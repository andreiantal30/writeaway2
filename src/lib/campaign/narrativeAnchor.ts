import { OpenAIConfig, generateWithOpenAI } from '../openai';
import { CampaignInput, GeneratedCampaign } from './types';

/**
 * Add narrative anchor to the campaign content
 * Provides a unifying storytelling thread through the campaign
 */
export const addNarrativeAnchor = async (
  campaign: Partial<GeneratedCampaign>,
  input: CampaignInput,
  openAIConfig: OpenAIConfig
): Promise<Partial<GeneratedCampaign>> => {
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

    const response = await generateWithOpenAI(prompt, openAIConfig);
    
    try {
      // First try to parse as JSON
      const parsedAnchor = JSON.parse(response);
      campaign.narrativeAnchor = parsedAnchor;
    } catch (error) {
      // If not valid JSON, extract from the text response
      const anchors = response
        .split("\n")
        .filter(line => line.trim().startsWith("-") || line.trim().startsWith("*"))
        .map(line => line.replace(/^[-*]\s+/, "").trim());
      
      campaign.narrativeAnchor = {
        anchors: anchors.length > 0 ? anchors : ["Emotional connection", "Brand authenticity"],
        rationale: "Derived from campaign insights and objectives"
      };
    }
    
    return campaign;
  } catch (error) {
    console.error("Error adding narrative anchor:", error);
    // Provide a default narrative anchor if generation fails
    campaign.narrativeAnchor = {
      anchors: ["Emotional connection", "Brand authenticity"],
      rationale: "Default anchor based on brand positioning"
    };
    
    return campaign;
  }
};
