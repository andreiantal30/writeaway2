
import { GeneratedCampaign } from './types';
import { OpenAIConfig, generateWithOpenAI } from '../openai';

/**
 * Pattern to detect emotional warmth markers in content
 */
const EMOTIONAL_WARMTH_PATTERN = /hope|connection|joy|pride|resilience|community|empathy|inspire|compassion|gratitude|love|unity/i;

/**
 * Check if a campaign has sufficient emotional warmth in its storytelling
 */
export const hasEmotionalWarmth = (campaign: GeneratedCampaign): boolean => {
  if (!campaign.storytelling?.fullNarrative) return false;
  
  return EMOTIONAL_WARMTH_PATTERN.test(campaign.storytelling.fullNarrative);
};

/**
 * Apply emotional rebalancing to ensure the campaign maintains human connection
 * despite disruptive elements that might make it feel too edgy or cold
 */
export const applyEmotionalRebalance = async (
  campaign: GeneratedCampaign,
  openAIConfig: OpenAIConfig
): Promise<GeneratedCampaign> => {
  // Skip if the campaign already has emotional warmth
  if (hasEmotionalWarmth(campaign)) {
    console.log("✅ Campaign already has emotional warmth - skipping rebalance");
    return campaign;
  }
  
  console.log("🔄 Applying emotional rebalance to storytelling");
  
  try {
    // Only rebalance if storytelling exists
    if (campaign.storytelling?.fullNarrative) {
      const prompt = `
You are a gifted storyteller whose task is to maintain the emotional balance in brand stories.

The following campaign storytelling narrative is impactful but lacks emotional warmth:

---
${campaign.storytelling.fullNarrative}
---

Please rewrite this narrative to maintain all of its strategic boldness, disruption, and powerful insights, but add elements of emotional connection.

The revised narrative should:
1. Keep the same basic structure and core message
2. Maintain the disruptive and bold elements that give it impact
3. Add subtle elements of human connection like hope, resilience, community, empathy, or joy
4. Be authentic and not feel artificially emotional or cheesy
5. Keep approximately the same length

Output only the revised narrative text with no additional commentary.
`;

      const enhancedNarrative = await generateWithOpenAI(prompt, openAIConfig);
      
      // Create a new campaign object with the enhanced narrative
      return {
        ...campaign,
        storytelling: {
          ...campaign.storytelling,
          fullNarrative: enhancedNarrative.trim()
        }
      };
    }
  } catch (error) {
    console.error("Error applying emotional rebalance:", error);
  }
  
  // Return the original campaign if there was an error or no storytelling
  return campaign;
};
