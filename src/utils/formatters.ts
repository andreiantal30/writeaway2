
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
    // First attempt: Remove markdown code block syntax completely
    // Support both ```json and ``` without language specifier
    const strippedMarkdown = text.replace(/```(?:json)?\s*|```$/gm, '').trim();
    
    // Second attempt: Look for content between JSON code blocks if still present
    const jsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
    const match = strippedMarkdown.match(jsonRegex);
    
    if (match && match[1]) {
      console.log("Extracted JSON from code block");
      return match[1].trim();
    }
    
    // Third attempt: Look for content that looks like JSON object
    const jsonObjectMatch = strippedMarkdown.match(/\{[\s\S]*\}/);
    if (jsonObjectMatch) {
      console.log("Extracted JSON from response body");
      return jsonObjectMatch[0].trim();
    }
    
    // If all else fails, return the original stripped text
    console.log("Using stripped markdown text as JSON");
    return strippedMarkdown;
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
    
    // Log the first 200 chars of the string we're about to parse (for debugging)
    console.log("Parsing JSON (first 200 chars):", cleanedJson.substring(0, 200) + (cleanedJson.length > 200 ? '...' : ''));
    
    // Try to parse the cleaned JSON
    return JSON.parse(cleanedJson) as T;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    console.error("Problematic JSON string (first 200 chars):", jsonString.substring(0, 200) + (jsonString.length > 200 ? '...' : ''));
    return defaultValue;
  }
}
