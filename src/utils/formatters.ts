
// Import from the proper casing path
import { ReferenceCampaign } from '@/types/campaign';

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
 * Extracts JSON from a response string with robust error handling
 * Handles various formats returned by GPT including markdown code blocks
 */
export function extractJsonFromResponse(text: string): string {
  if (!text) return "{}";
  
  try {
    // First attempt: Look for content between JSON code blocks
    const jsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
    const match = text.match(jsonRegex);
    
    if (match && match[1]) {
      return match[1].trim();
    }
    
    // Second attempt: Look for content that looks like JSON
    const jsonObjectMatch = text.match(/\{[\s\S]*\}/);
    if (jsonObjectMatch) {
      return jsonObjectMatch[0].trim();
    }
    
    // If all else fails, return the original text
    console.log("Warning: Could not extract JSON format, returning raw text");
    return text.trim();
  } catch (error) {
    console.error("Error extracting JSON from response:", error);
    return "{}";
  }
}

/**
 * Safely parses JSON with error handling
 * Returns a default value if parsing fails
 */
export function safeJsonParse<T>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    console.log("Problematic JSON string:", jsonString);
    return defaultValue;
  }
}
