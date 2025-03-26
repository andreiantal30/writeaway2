
import { toast } from "sonner";
import { Campaign } from './campaignData';
import { generateWithOpenAI, OpenAIConfig, defaultOpenAIConfig, evaluateCampaign } from './openai';
import { generateStorytellingNarrative } from './storytellingGenerator';
import { CampaignInput, GeneratedCampaign, CampaignEvaluation, CampaignVersion } from './campaign/types';
import { findSimilarCampaigns } from './campaign/campaignMatcher';
import { generateCreativeInsights } from './campaign/creativeInsightGenerator';
import { createCampaignPrompt } from './campaign/campaignPromptBuilder';
import { extractJsonFromResponse } from './campaign/utils';
import { getCreativeDevicesForStyle } from '@/data/creativeDevices';
import { getCachedCulturalTrends } from '@/data/culturalTrends';

/**
 * Main function to generate a campaign using AI
 */
export const generateCampaign = async (
  input: CampaignInput, 
  openAIConfig: OpenAIConfig = defaultOpenAIConfig
): Promise<GeneratedCampaign> => {
  try {
    // Generate creative insights
    const creativeInsights = await generateCreativeInsights(input, openAIConfig);
    console.log("Generated Creative Insights:", creativeInsights);
    
    // Find similar reference campaigns
    const referenceCampaigns = await findSimilarCampaigns(input, openAIConfig);
    
    console.log("Matched Reference Campaigns:", 
      referenceCampaigns.map(c => ({
        name: c.name,
        brand: c.brand,
        industry: c.industry
      }))
    );

    // Select creative devices based on campaign style
    const creativeDevices = getCreativeDevicesForStyle(input.campaignStyle, 2);
    console.log("Selected Creative Devices:", creativeDevices.map(d => d.name));
    
    // Get relevant cultural trends
    const culturalTrends = getCachedCulturalTrends();
    const relevantTrends = culturalTrends.slice(0, 2); // Just take top 2 for now
    
    if (relevantTrends.length > 0) {
      console.log("Incorporating Cultural Trends:", 
        relevantTrends.map(t => t.title)
      );
    }
    
    // Create the campaign generation prompt
    // The createCampaignPrompt function needs to be updated to accept relevantTrends
    const prompt = createCampaignPrompt(
      input, 
      referenceCampaigns, 
      creativeInsights, 
      creativeDevices
    );
    
    console.log("Prompt Preview (first 200 chars):", prompt.substring(0, 200));
    
    // Generate the campaign with OpenAI
    const response = await generateWithOpenAI(prompt, openAIConfig);
    
    const cleanedResponse = extractJsonFromResponse(response);
    
    const generatedContent = JSON.parse(cleanedResponse);
    
    const campaign: GeneratedCampaign = {
      ...generatedContent,
      referenceCampaigns,
      creativeInsights
    };
    
    // Generate storytelling narrative
    try {
      const storytellingInput = {
        brand: input.brand,
        industry: input.industry,
        targetAudience: input.targetAudience,
        emotionalAppeal: input.emotionalAppeal,
        campaignName: campaign.campaignName,
        keyMessage: campaign.keyMessage
      };
      
      const storytelling = await generateStorytellingNarrative(storytellingInput, openAIConfig);
      campaign.storytelling = storytelling;
    } catch (error) {
      console.error("Error generating storytelling content:", error);
      toast.error("Error generating storytelling content");
    }
    
    // Generate campaign evaluation
    try {
      const evaluation: CampaignEvaluation = await evaluateCampaign(campaign, openAIConfig);
      campaign.evaluation = evaluation;
    } catch (error) {
      console.error("Error evaluating campaign:", error);
    }
    
    return campaign;
  } catch (error) {
    console.error("Error generating campaign:", error);
    throw error;
  }
};

// Re-export types for backwards compatibility
export type { CampaignInput, GeneratedCampaign, CampaignVersion };
