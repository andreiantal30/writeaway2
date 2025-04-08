import { toast } from "sonner";
import { OpenAIConfig, defaultOpenAIConfig, generateWithOpenAI } from '../openai';
import { CampaignInput, GeneratedCampaign, CreativeInsights, StorytellingOutput } from './types';
import { findSimilarCampaigns } from './campaignMatcher';
import { generateCreativeInsights } from './creativeInsightGenerator';
import { createCampaignPrompt } from './campaignPromptBuilder';
import { extractJsonFromResponse, safeJsonParse } from '../../utils/formatters';
import { getCreativeDevicesForStyle } from '../../data/creativeDevices';
import { getCachedCulturalTrends } from '../../data/culturalTrends';
import { generateStorytellingNarrative } from './storytellingGenerator';
import { evaluateCampaign } from './evaluateCampaign';
import { applyStrategyBooster } from './strategyBooster';
import { addNarrativeAnchor } from './narrativeAnchor';
import { applyExecutionFilters } from './executionFilters';
import { calculateBraveryMatrix, BraveryScores } from './calculateBraveryMatrix';
import { applyEmotionalRebalance } from './emotionalRebalance';
import { ReferenceCampaign, CulturalTrend, CreativeDevice } from '../../types/campaign';

/**
 * Apply Insight scoring to analyze quality of insights
 */
const applyInsightScoring = async (campaign: Partial<GeneratedCampaign>, openAIConfig: OpenAIConfig) => {
  if (!campaign.creativeInsights) return campaign;
  
  try {
    const insights = [
      campaign.creativeInsights.surfaceInsight,
      campaign.creativeInsights.emotionalUndercurrent,
      campaign.creativeInsights.creativeUnlock
    ];
    
    const prompt = `
Analyze these creative insights for contradiction, irony, and tension - elements that make insights powerful:
1. ${insights[0]}
2. ${insights[1]}
3. ${insights[2]}

For each insight, score it from 1-10 on these criteria:
- Contradiction: Does it reveal opposing forces?
- Irony: Does it highlight unexpected truths?
- Tension: Does it create cognitive dissonance?

Return ONLY a JSON object with scores, no explanation:
{
  "insight1": {"contradiction": 7, "irony": 5, "tension": 8},
  "insight2": {"contradiction": 4, "irony": 6, "tension": 5},
  "insight3": {"contradiction": 9, "irony": 8, "tension": 9}
}`;

    const response = await generateWithOpenAI(prompt, openAIConfig);
    const cleanedResponse = extractJsonFromResponse(response);
    
    const defaultScores = {
      insight1: {contradiction: 5, irony: 5, tension: 5},
      insight2: {contradiction: 5, irony: 5, tension: 5},
      insight3: {contradiction: 5, irony: 5, tension: 5}
    };
    
    const scores = safeJsonParse(cleanedResponse, defaultScores);
    console.log("📊 Insight scores calculated:", scores);
    
    campaign.insightScores = scores;
  } catch (err) {
    console.error("⚠️ Insight scoring failed:", err);
  }
  
  return campaign;
};

/**
 * Apply Cannes Spike to add award-worthy tactics if missing
 */
const applyCannesSpike = async (campaign: Partial<GeneratedCampaign>, openAIConfig: OpenAIConfig) => {
  if (!campaign.executionPlan) return campaign;
  
  const hasCannesWorthy = campaign.executionPlan.some(item => 
    item.toLowerCase().includes("disrupt") || 
    item.toLowerCase().includes("innovate") || 
    item.toLowerCase().includes("first-ever")
  );
  
  if (!hasCannesWorthy) {
    try {
      const prompt = `
You are an award-winning creative director reviewing this campaign execution plan:
${campaign.executionPlan.join('\n')}

Add ONE bold, Cannes Lions worthy tactic that would elevate this campaign to award-winning status. 
It should be unexpected, culturally relevant, and technically innovative. 
Return ONLY the new tactic as plain text, no explanation or commentary.
`;
      
      const response = await generateWithOpenAI(prompt, openAIConfig);
      
      if (response && response.trim()) {
        campaign.executionPlan.push(response.trim());
        console.log("🏆 Cannes Spike added");
      }
    } catch (err) {
      console.error("⚠️ Cannes Spike failed:", err);
    }
  }
  
  return campaign;
};

/**
 * Apply Creative Director pass to improve campaign quality
 */
const applyCreativeDirectorPass = async (rawOutput: any) => {
  try {
    const res = await fetch('/api/cd-pass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rawOutput),
    });
    
    if (!res.ok) {
      console.error(`CD pass API error: ${res.status}`);
      return rawOutput; // Return original if API fails
    }
    
    return await res.json();
  } catch (err) {
    console.error("CD pass failed:", err);
    return rawOutput; // Return original if API fails
  }
};

/**
 * Apply Disruptive Device via API
 */
const applyDisruptivePass = async (campaign: Partial<GeneratedCampaign>) => {
  try {
    const res = await fetch('/api/disruptive-pass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaign),
    });

    if (!res.ok) {
      throw new Error(`Disruptive pass API error: ${res.status}`);
    }
    
    const jsonResponse = await res.json();
    console.log("🎯 Disruptive twist added");
    return jsonResponse;
  } catch (err) {
    console.error("⚠️ Disruptive device injection failed:", err);
    toast.error("Disruptive enhancement failed, using base campaign");
    return campaign;
  }
};

/**
 * Check if campaign needs disruption based on insight safety and execution flatness
 * and add disruptive element if needed
 */
const applyWeaknessBasedDisruption = async (campaign: Partial<GeneratedCampaign>, openAIConfig: OpenAIConfig) => {
  try {
    // Check if insights or execution plan are too safe/flat
    const isInsightSafe = (campaign.insightScores?.insight1?.tension || 0) < 5;
    const isExecutionFlat = (campaign.executionPlan || []).length < 3;
    const needsDisruption = isInsightSafe || isExecutionFlat;
    
    console.log("Disruption Triggered:", {
      isInsightSafe,
      isExecutionFlat
    });
    
    if (needsDisruption) {
      const disruptionPrompt = `
This campaign lacks tension or boldness. Here's the current version:

Strategy:
${campaign.strategy}

Execution Plan:
${campaign.executionPlan?.join('\n')}

Insight:
${campaign.creativeInsights?.surfaceInsight}

Now inject ONE unexpected twist that would make this idea feel rebellious, culture-poking, or emotionally raw. Return ONLY the new execution as plain text.
`;

      const disruption = await generateWithOpenAI(disruptionPrompt, openAIConfig);
      if (disruption && disruption.trim()) {
        if (!campaign.executionPlan) {
          campaign.executionPlan = [];
        }
        campaign.executionPlan.push(disruption.trim());
        
        // Add to CD modifications tracking if it exists
        if (!campaign._cdModifications) {
          campaign._cdModifications = [];
        }
        campaign._cdModifications.push("Injected strategic disruption based on weakness");
        console.log("⚔️ Weakness-based disruption injected");
      }
    }
  } catch (error) {
    console.error("Error applying weakness-based disruption:", error);
  }
  
  return campaign;
};

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
    const referenceCampaignsResponse = await findSimilarCampaigns(input, openAIConfig);
    // Cast to ReferenceCampaign[] to fix type error
    const referenceCampaigns = referenceCampaignsResponse as unknown as ReferenceCampaign[];
    
    console.log("Matched Reference Campaigns:", 
      referenceCampaigns.map(c => ({
        name: c.name,
        brand: c.brand,
        industry: c.industry
      }))
    );

    // Select creative devices based on campaign style
    const creativeDevices = getCreativeDevicesForStyle(input.campaignStyle || 'bold', 3);
    console.log("Selected Creative Devices:", creativeDevices.map(d => d.name));
    
    // Get relevant cultural trends
    const culturalTrends = getCachedCulturalTrends();

    // Give priority to non-tech trends for variety
    const prioritized = [
      ...culturalTrends.filter(t =>
        !t.platformTags.some(tag => tag.toLowerCase().includes("ai") || 
                                   tag.toLowerCase().includes("ar") || 
                                   tag.toLowerCase().includes("vr"))
      ),
      ...culturalTrends.filter(t =>
        t.platformTags.some(tag => tag.toLowerCase().includes("ai") || 
                                  tag.toLowerCase().includes("ar"))
      )
    ];
    
    // Shuffle and take 3 from the reordered list
    const relevantTrends = prioritized
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    if (relevantTrends.length > 0) {
      console.log("Incorporating Cultural Trends:", relevantTrends.map(t => t.title));
    }
    
    // Create the campaign generation prompt
    const prompt = createCampaignPrompt(
      input, 
      referenceCampaigns, 
      [creativeInsights.surfaceInsight, creativeInsights.emotionalUndercurrent, creativeInsights.creativeUnlock], 
      creativeDevices,
      relevantTrends
    );
    
    console.log("Prompt Preview (first 200 chars):", prompt.substring(0, 200));
    
    // Generate the campaign with OpenAI
    const response = await generateWithOpenAI(prompt, openAIConfig);
    const cleanedResponse = extractJsonFromResponse(response);
    
    // Default campaign if parsing fails
    const defaultCampaign = {
      campaignName: `${input.brand} Campaign`,
      keyMessage: `${input.brand} helps ${input.targetAudience[0] || 'people'} experience ${input.emotionalAppeal[0] || 'connection'}.`,
      brand: input.brand,
      strategy: "Connect the brand with its audience through authentic experiences.",
      executionPlan: ["Social media campaign", "Influencer partnerships", "Event activation"],
      viralElement: "Shareable social media content",
      prHeadline: `${input.brand} Launches Innovative Campaign`,
      consumerInteraction: "Users can share their experiences on social media",
      callToAction: "Join the experience today",
      creativeStrategy: ["Authenticity", "Emotional connection"]
    };
    
    // Use safe JSON parse with fallback
    let generatedContent = safeJsonParse(cleanedResponse, defaultCampaign);

    // ===== POST-GENERATION LAYERS (NEW SEQUENCE) =====

    // Initialize a campaign object with the required fields
    let campaign: Partial<GeneratedCampaign> = {
      ...generatedContent,
      creativeInsights: creativeInsights,
      emotionalAppeal: input.emotionalAppeal,
      brand: input.brand,
      referenceCampaigns
    };
    
    // ===== 1. Apply Insight Scoring =====
    campaign = await applyInsightScoring(campaign, openAIConfig);
    console.log("✅ Insight scoring applied");

    // ===== 2. Apply Strategy Booster =====
    campaign = await applyStrategyBooster(campaign, input, openAIConfig);
    console.log("✅ Strategy booster applied");
    
    // ===== 3. Add Narrative Anchor =====
    campaign = await addNarrativeAnchor(campaign, input, openAIConfig);
    console.log("✅ Narrative anchor added");
    
    // ===== 4. Apply Execution Filters (reduces to 4-5 boldest ideas) =====
    campaign = await applyExecutionFilters(campaign, input, openAIConfig);
    console.log("✅ Execution filters applied");
    
    // ===== 5. NEW: Apply Weakness-Based Disruption =====
    campaign = await applyWeaknessBasedDisruption(campaign, openAIConfig);
    console.log("✅ Weakness-based disruption check applied");
    
    // ===== 6. Apply Cannes Spike (adds award-worthy tactic if missing) =====
    campaign = await applyCannesSpike(campaign, openAIConfig);
    console.log("✅ Cannes spike applied if needed");

    // ===== 7. Inject Disruptive Device via API =====
    campaign = await applyDisruptivePass(campaign);
    console.log("✅ Disruptive pass applied");

    // ===== 8. Apply Creative Director refinement =====
    campaign = await applyCreativeDirectorPass(campaign);
    console.log("✅ Creative Director pass applied");

    // ===== 9. Calculate Bravery Matrix =====
    const braveryScores = calculateBraveryMatrix(campaign as GeneratedCampaign);
    console.log("✅ Bravery matrix calculated:", braveryScores);
    campaign.braveryScores = braveryScores;

    // If evaluation exists, add bravery score to it
    if (campaign.evaluation) {
      campaign.evaluation.braveryScore = braveryScores.totalScore;
    }

    // Ensure all required fields are present in the final campaign
    const finalCampaign: GeneratedCampaign = {
      // Core fields from generated content
      campaignName: campaign.campaignName || "Untitled Campaign",
      keyMessage: campaign.keyMessage || improviseKeyMessage(input),
      brand: input.brand,
      strategy: campaign.strategy || "",
      executionPlan: campaign.executionPlan || [],
      viralElement: campaign.viralElement || (campaign as any).viralHook || "",
      prHeadline: campaign.prHeadline || "",
      consumerInteraction: campaign.consumerInteraction || "",
      callToAction: campaign.callToAction || "",
      
      // Additional fields
      creativeInsights: creativeInsights,
      emotionalAppeal: input.emotionalAppeal,
      creativeStrategy: campaign.creativeStrategy || [],
      referenceCampaigns,
      expectedOutcomes: campaign.expectedOutcomes || [],
      
      // Optional enhancement fields
      narrativeAnchor: campaign.narrativeAnchor,
      executionFilterRationale: campaign.executionFilterRationale,
      insightScores: campaign.insightScores,
      braveryScores: campaign.braveryScores,
      viralHook: (campaign as any).viralHook || ""
    };
    
    // Generate storytelling narrative
    try {
      const storytellingInput = {
        brand: input.brand,
        industry: input.industry,
        targetAudience: input.targetAudience,
        emotionalAppeal: input.emotionalAppeal,
        campaignName: finalCampaign.campaignName,
        keyMessage: finalCampaign.keyMessage
      };
      
      const storytelling = await generateStorytellingNarrative(storytellingInput, openAIConfig);
      finalCampaign.storytelling = storytelling;
    } catch (error) {
      console.error("Error generating storytelling content:", error);
      toast.error("Error generating storytelling content");
    }
    
    // Generate campaign evaluation
    try {
      const evaluation = await evaluateCampaign(finalCampaign, openAIConfig);
      
      // Add bravery score to evaluation
      if (evaluation) {
        evaluation.braveryScore = braveryScores.totalScore;
      }
      
      finalCampaign.evaluation = evaluation;
    } catch (error) {
      console.error("Error evaluating campaign:", error);
    }

    // ===== 10. Apply Emotional Rebalance =====
    try {
      const emotionallyBalancedCampaign = await applyEmotionalRebalance(finalCampaign, openAIConfig);
      console.log("✅ Emotional rebalance applied");
      return emotionallyBalancedCampaign;
    } catch (error) {
      console.error("Error applying emotional rebalance:", error);
      // Return the original campaign if emotional rebalance fails
      return finalCampaign;
    }
    
  } catch (error) {
    console.error("Error generating campaign:", error);
    throw error;
  }
};

// Fallback function to create a key message if missing from API response
function improviseKeyMessage(input: CampaignInput): string {
  return `${input.brand} helps ${input.targetAudience[0] || 'people'} experience ${input.emotionalAppeal[0] || 'connection'} in the ${input.industry} industry.`;
}

// Export types for backwards compatibility
export type { CampaignInput, GeneratedCampaign };
