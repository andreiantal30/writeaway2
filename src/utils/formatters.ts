
import { ReferenceCampaign } from '../types/campaign';

/**
 * Formats a campaign for inclusion in a prompt
 */
export function formatCampaignForPrompt(campaign: ReferenceCampaign): string {
  return `
### ${campaign.name} (${campaign.brand}, ${campaign.year || 'N/A'})
${campaign.description}

**Strategy:** ${campaign.strategy}
**Target:** ${campaign.targetAudience.join(', ')}
**Emotional Appeal:** ${campaign.emotionalAppeal.join(', ')}
**Creative Activation:** ${campaign.creativeActivation || 'N/A'}
${campaign.results ? `**Results:** ${campaign.results}` : ''}
${campaign.awards?.length ? `**Awards:** ${campaign.awards.join(', ')}` : ''}
  `.trim();
}

/**
 * Extracts JSON from a response string
 */
export function extractJsonFromResponse(text: string): string {
  // Look for content between JSON code blocks
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  
  if (jsonMatch && jsonMatch[1]) {
    return jsonMatch[1].trim();
  }
  
  // If no code blocks found, look for content that looks like JSON
  const jsonObjectMatch = text.match(/\{[\s\S]*\}/);
  if (jsonObjectMatch) {
    return jsonObjectMatch[0].trim();
  }
  
  // If all else fails, return the original text
  return text;
}
