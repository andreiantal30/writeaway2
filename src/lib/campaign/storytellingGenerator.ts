
import { generateWithOpenAI, OpenAIConfig } from '../openai';
import { StorytellingOutput } from './types';
import { CampaignInput } from '../../types/campaign';

export interface StorytellingInput {
  brand: string;
  industry: string;
  targetAudience: string[];
  emotionalAppeal: string[];
  campaignName: string;
  keyMessage: string;
}

/**
 * Generate a storytelling narrative based on campaign inputs
 */
export async function generateStorytellingNarrative(
  input: StorytellingInput,
  openAIConfig: OpenAIConfig
): Promise<StorytellingOutput> {
  const prompt = `
You're a top-tier brand storyteller tasked with creating a powerful narrative.

Your task is to turn a campaign idea into a human, emotionally resonant narrative that could be used in a voiceover, manifesto film, or about section of a case study. 

Please structure your output as a complete storytelling framework with these components:
1. Hook - A compelling opening line that draws attention (10-15 words)
2. Protagonist - Who is the main character or focus (a person, group, or concept)
3. Conflict - What tension, challenge or problem exists
4. Journey - The experiences, transformation or path that occurs
5. Resolution - How the brand helps resolve the conflict
6. Full Narrative - A complete 150-200 word narrative that weaves all elements together

Tone: authentic, vivid, emotionally insightful — not cheesy or generic. Use sensory language, compelling metaphors, and rhythm to create a narrative that resonates with the target audience.

Here's the campaign input:

- Brand: ${input.brand}
- Industry: ${input.industry}
- Target Audience: ${input.targetAudience.join(", ")}
- Emotional Appeal: ${input.emotionalAppeal.join(", ")}
- Campaign Name: ${input.campaignName}
- Key Message: ${input.keyMessage}

Return a JSON object with these keys: hook, protagonist, conflict, journey, resolution, fullNarrative
`;

  try {
    const response = await generateWithOpenAI(prompt, openAIConfig);
    let storytellingData: Partial<StorytellingOutput> = {};
    
    try {
      // Try to parse as JSON first
      storytellingData = JSON.parse(response.trim());
    } catch (parseError) {
      // If not JSON, use the entire response as the narrative
      console.warn("Failed to parse storytelling response as JSON:", parseError);
      storytellingData = { narrative: response.trim() };
    }
    
    // Build the output ensuring all fields are present
    const result: StorytellingOutput = {
      narrative: storytellingData.fullNarrative || storytellingData.narrative || response.trim(),
      hook: storytellingData.hook || '',
      protagonist: storytellingData.protagonist || '',
      conflict: storytellingData.conflict || '',
      journey: storytellingData.journey || '',
      resolution: storytellingData.resolution || '',
      fullNarrative: storytellingData.fullNarrative || response.trim(),
      // Additional context fields if available
      protagonistDescription: storytellingData.protagonistDescription || storytellingData.protagonist || '',
      conflictDescription: storytellingData.conflictDescription || storytellingData.conflict || '',
      resolutionDescription: storytellingData.resolutionDescription || storytellingData.resolution || '',
      brandValueConnection: storytellingData.brandValueConnection || '',
      audienceRelevance: storytellingData.audienceRelevance || '',
      storyNarrative: storytellingData.storyNarrative || storytellingData.fullNarrative || response.trim()
    };

    return result;
  } catch (error) {
    console.error("Failed to generate storytelling narrative:", error);
    // Return a minimal valid object in case of error
    return { 
      narrative: "An error occurred while generating the storytelling narrative.",
      hook: "",
      protagonist: "",
      conflict: "",
      journey: "",
      resolution: "",
      fullNarrative: "",
      protagonistDescription: "",
      conflictDescription: "",
      resolutionDescription: "",
      brandValueConnection: "",
      audienceRelevance: "",
      storyNarrative: ""
    };
  }
}
