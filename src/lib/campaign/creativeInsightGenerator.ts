
import { CampaignInput } from './types';
import { generateWithOpenAI, OpenAIConfig } from '../openai';
import { extractJsonFromResponse, safeJsonParse } from '../../utils/formatters';
import { CreativeInsights } from './types';

/**
 * Generate creative insights for campaign generation
 */
export async function generateCreativeInsights(
  input: CampaignInput,
  config: OpenAIConfig
): Promise<CreativeInsights> {
  try {
    const currentYear = new Date().getFullYear();
    const audienceString = input.targetAudience.join(', ');
    const objectivesString = input.objectives.join(', ');
    
    const prompt = `
### Creative Insight Builder

Generate powerful insights about the target audience that will unlock creative potential for this campaign. 
These should capture tensions, truths, or emotional realities that the target audience experiences in ${currentYear}.

**Target Audience:** ${audienceString}
**Brand:** ${input.brand}
**Industry:** ${input.industry}
**Campaign Objectives:** ${objectivesString}
**Emotional Appeal to Tap Into:** ${input.emotionalAppeal.join(', ')}

Create three layers of insights:
1. Surface Insight: The obvious, superficial observation
2. Emotional Undercurrent: The deeper emotional truth behind the surface
3. Creative Unlock: The surprising twist that creates tension and opportunity

Format your response as a JSON object:
\`\`\`json
{
  "surfaceInsight": "Clear statement of what's observable",
  "emotionalUndercurrent": "Deeper emotional truth statement",
  "creativeUnlock": "Surprising twist that creates opportunity"
}
\`\`\`

The best insights will reveal something that feels true but hasn't been overly exploited in marketing.
`;

    const response = await generateWithOpenAI(prompt, config);
    const cleanedResponse = extractJsonFromResponse(response);
    
    // Default fallback insights in case parsing fails
    const fallbackInsights: CreativeInsights = {
      surfaceInsight: "The audience seeks authentic connections in an increasingly digital world.",
      emotionalUndercurrent: "Beneath the surface, there's a fear of missing meaningful human experiences.",
      creativeUnlock: "The most shareable moments are those that bridge digital convenience with analog emotion."
    };
    
    // Use our safe JSON parser with fallback
    return safeJsonParse<CreativeInsights>(cleanedResponse, fallbackInsights);
  } catch (error) {
    console.error("Error generating creative insights:", error);
    
    // Provide fallback insights if API call fails
    return {
      surfaceInsight: "The audience seeks authentic connections in an increasingly digital world.",
      emotionalUndercurrent: "Beneath the surface, there's a fear of missing meaningful human experiences.",
      creativeUnlock: "The most shareable moments are those that bridge digital convenience with analog emotion."
    };
  }
}
