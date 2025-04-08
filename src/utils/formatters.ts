
// Import with correct casing
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
  if (!text) {
    console.log("Warning: Empty response received");
    return "{}";
  }
  
  try {
    // First attempt: Look for content between JSON code blocks
    const jsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
    const match = text.match(jsonRegex);
    
    if (match && match[1]) {
      console.log("Extracted JSON from code block");
      return match[1].trim();
    }
    
    // Second attempt: Look for content that looks like JSON
    const jsonObjectMatch = text.match(/\{[\s\S]*\}/);
    if (jsonObjectMatch) {
      console.log("Extracted JSON from response body");
      return jsonObjectMatch[0].trim();
    }
    
    // If all else fails, return the original text
    console.log("Warning: Could not extract JSON format, returning raw text");
    console.log("First 100 chars of text:", text.substring(0, 100));
    return text.trim();
  } catch (error) {
    console.error("Error extracting JSON from response:", error);
    console.error("First 100 chars of problematic text:", text.substring(0, 100));
    return "{}";
  }
}

/**
 * Safely parses JSON with error handling
 * Returns a default value if parsing fails
 */
export function safeJsonParse<T>(jsonString: string, defaultValue: T): T {
  if (!jsonString || jsonString.trim() === '') {
    console.warn("Empty JSON string provided to parser");
    return defaultValue;
  }
  
  try {
    // Try to clean up common JSON issues before parsing
    let cleanedJson = jsonString.trim();
    
    // Replace any potential dangling commas which are common in LLM outputs
    cleanedJson = cleanedJson.replace(/,\s*}/g, '}').replace(/,\s*\]/g, ']');
    
    // Try to parse the cleaned JSON
    return JSON.parse(cleanedJson) as T;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    console.error("Problematic JSON string:", jsonString.substring(0, 200) + (jsonString.length > 200 ? '...' : ''));
    return defaultValue;
  }
}
