
import { OpenAIConfig, generateWithOpenAI } from '../openai';
import { CampaignInput, GeneratedCampaign } from './types';
import { extractJsonFromResponse, safeJsonParse } from '../../utils/formatters';
import { isServer } from '../utils/envVariables';
import { createOpenAIClient } from '../openai/client';

/**
 * Apply execution filters to improve campaign execution plan
 * Keeps only the 4-5 boldest and most effective execution ideas
 */
export async function applyExecutionFilters(
  campaign: Partial<GeneratedCampaign>,
  input: CampaignInput,
  config: OpenAIConfig
): Promise<Partial<GeneratedCampaign>> {
  // Skip if campaign doesn't have execution plan or has 5 or fewer items already
  if (!campaign.executionPlan || !Array.isArray(campaign.executionPlan) || campaign.executionPlan.length <= 5) {
    console.log("Execution filters skipped (plan already has 5 or fewer items)");
    return campaign;
  }
  
  try {
    const prompt = `
You are a bold, award-winning Creative Director evaluating execution tactics for a campaign.

Brand: ${input.brand}
Industry: ${input.industry}
Campaign Name: ${campaign.campaignName || 'Untitled Campaign'}
Target Audience: ${input.targetAudience.join(', ')}

Here is the current execution plan:
${campaign.executionPlan.map((item, i) => `${i+1}. ${item}`).join('\n')}

Score each tactic from 1-10 based on:
- Bravery (how unexpected and daring is it?)
- Cultural relevance (how connected to current cultural dynamics?)
- Viral potential (how likely to spread through social sharing?)
- Brand fit (how well does it reinforce the brand positioning?)

Then select ONLY the 4-5 BOLDEST tactics that would create the strongest, most award-worthy campaign.

Format your response as JSON:
\`\`\`json
{
  "selectedTactics": [
    "First bold tactic text",
    "Second bold tactic text",
    "Third bold tactic text",
    "Fourth bold tactic text",
    "Fifth bold tactic text (if needed)"
  ],
  "explanation": "Brief explanation of why these are the strongest tactics"
}
\`\`\`
`;

    let response;
    
    // Use server-side API key if running on server
    if (isServer()) {
      const openai = createOpenAIClient();
      const completion = await openai.chat.completions.create({
        model: config.model || 'gpt-4o',
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });
      response = completion.choices[0].message.content || '';
    } else {
      // Fall back to provided config (this would be the client-side path)
      response = await generateWithOpenAI(prompt, config);
    }
    
    const cleanedResponse = extractJsonFromResponse(response);
    
    // Default fallback structure
    const defaultResult = {
      selectedTactics: campaign.executionPlan.slice(0, 5),
      explanation: "Selected based on highest potential impact and memorability."
    };
    
    // Use safe JSON parsing with fallback
    const result = safeJsonParse(cleanedResponse, defaultResult);
    
    if (result.selectedTactics && Array.isArray(result.selectedTactics) && result.selectedTactics.length > 0) {
      // Replace the execution plan with the filtered selection
      campaign.executionPlan = result.selectedTactics;
      
      // Add the execution filter rationale to campaign object
      campaign.executionFilterRationale = result.explanation;
      
      console.log("Execution filter applied:", result.explanation);
    }
    
    return campaign;
  } catch (error) {
    console.error("Error applying execution filters:", error);
    return campaign; // Return original campaign if filtering fails
  }
}
