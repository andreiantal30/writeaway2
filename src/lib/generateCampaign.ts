import { Campaign } from './campaignData';
import { generateWithOpenAI, OpenAIConfig, defaultOpenAIConfig } from './openai';
import { getCampaigns } from './campaignStorage';

export interface CampaignInput {
  brand: string;
  industry: string;
  targetAudience: string[];
  objectives: string[];
  emotionalAppeal: string[];
  additionalConstraints?: string;
  campaignStyle?: "digital" | "experiential" | "social";
}

export interface GeneratedCampaign {
  campaignName: string;
  keyMessage: string;
  creativeStrategy: string[];
  executionPlan: string[];
  expectedOutcomes: string[];
  referenceCampaigns: Campaign[];
}

// Sentiment categories for more nuanced matching
type SentimentCategory = 'positive' | 'neutral' | 'negative';
type ToneCategory = 'formal' | 'casual' | 'humorous' | 'serious' | 'inspirational';

interface EnhancedSimilarityScore {
  campaign: Campaign;
  totalScore: number;
  dimensionScores: {
    industry: number;
    audience: number;
    objectives: number;
    emotion: number;
    style: number;
    sentiment: number;
    tone: number;
  };
}

/**
 * Determine sentiment category based on emotional appeal
 */
const determineSentiment = (emotionalAppeal: string[]): SentimentCategory => {
  const positiveEmotions = ['joy', 'happiness', 'excitement', 'optimism', 'inspiration', 'pride', 'comfort'];
  const negativeEmotions = ['fear', 'anxiety', 'sadness', 'anger', 'guilt', 'shame'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  emotionalAppeal.forEach(emotion => {
    const lowerEmotion = emotion.toLowerCase();
    if (positiveEmotions.some(e => lowerEmotion.includes(e))) {
      positiveCount++;
    } else if (negativeEmotions.some(e => lowerEmotion.includes(e))) {
      negativeCount++;
    }
  });
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

/**
 * Determine tone category based on objectives and emotional appeal
 */
const determineTone = (objectives: string[], emotionalAppeal: string[]): ToneCategory => {
  // Check for formal indicators
  if (
    objectives.some(obj => obj.toLowerCase().includes('professional') || 
                           obj.toLowerCase().includes('authority') ||
                           obj.toLowerCase().includes('credibility'))
  ) {
    return 'formal';
  }
  
  // Check for humorous indicators
  if (
    emotionalAppeal.some(emo => emo.toLowerCase().includes('fun') || 
                               emo.toLowerCase().includes('humor') ||
                               emo.toLowerCase().includes('playful'))
  ) {
    return 'humorous';
  }
  
  // Check for inspirational indicators
  if (
    emotionalAppeal.some(emo => emo.toLowerCase().includes('inspir') || 
                               emo.toLowerCase().includes('motivat') ||
                               emo.toLowerCase().includes('empower'))
  ) {
    return 'inspirational';
  }
  
  // Check for serious indicators
  if (
    objectives.some(obj => obj.toLowerCase().includes('awareness') || 
                           obj.toLowerCase().includes('education') ||
                           obj.toLowerCase().includes('social change'))
  ) {
    return 'serious';
  }
  
  // Default to casual
  return 'casual';
};

/**
 * Enhanced function to find similar campaigns based on multi-dimensional scoring
 */
const findSimilarCampaigns = (input: CampaignInput): Campaign[] => {
  // Get campaigns from local storage or use default data
  const allCampaigns = getCampaigns();
  
  const inputSentiment = determineSentiment(input.emotionalAppeal);
  const inputTone = determineTone(input.objectives, input.emotionalAppeal);
  
  // Score each campaign based on multiple dimensions
  const scoredCampaigns: EnhancedSimilarityScore[] = allCampaigns.map(campaign => {
    // Initialize dimension scores
    const dimensionScores = {
      industry: 0,
      audience: 0,
      objectives: 0,
      emotion: 0,
      style: 0,
      sentiment: 0,
      tone: 0
    };
    
    // Industry match (0-5 points)
    if (campaign.industry.toLowerCase() === input.industry.toLowerCase()) {
      dimensionScores.industry = 5;
    } else if (campaign.industry.toLowerCase().includes(input.industry.toLowerCase()) || 
              input.industry.toLowerCase().includes(campaign.industry.toLowerCase())) {
      dimensionScores.industry = 3;
    }
    
    // Target audience match (0-5 points per match, max 15)
    let audienceMatchCount = 0;
    input.targetAudience.forEach(audience => {
      if (campaign.targetAudience.some(a => 
        a.toLowerCase().includes(audience.toLowerCase()) || 
        audience.toLowerCase().includes(a.toLowerCase())
      )) {
        audienceMatchCount++;
      }
    });
    dimensionScores.audience = Math.min(audienceMatchCount * 5, 15);
    
    // Objectives match (0-5 points per match, max 15)
    let objectivesMatchCount = 0;
    input.objectives.forEach(objective => {
      if (campaign.objectives.some(o => 
        o.toLowerCase().includes(objective.toLowerCase()) || 
        objective.toLowerCase().includes(o.toLowerCase())
      )) {
        objectivesMatchCount++;
      }
    });
    dimensionScores.objectives = Math.min(objectivesMatchCount * 5, 15);
    
    // Emotional appeal match (0-5 points per match, max 15)
    let emotionMatchCount = 0;
    input.emotionalAppeal.forEach(emotion => {
      if (campaign.emotionalAppeal.some(e => 
        e.toLowerCase().includes(emotion.toLowerCase()) || 
        emotion.toLowerCase().includes(e.toLowerCase())
      )) {
        emotionMatchCount++;
      }
    });
    dimensionScores.emotion = Math.min(emotionMatchCount * 5, 15);
    
    // Campaign style match (0-10 points)
    if (input.campaignStyle) {
      // Extract campaign style hints from the campaign strategy
      const campaignStrategy = campaign.strategy.toLowerCase();
      const isDigital = campaignStrategy.includes('digital') || 
                        campaignStrategy.includes('online') || 
                        campaignStrategy.includes('social media');
      const isExperiential = campaignStrategy.includes('event') || 
                             campaignStrategy.includes('experience') || 
                             campaignStrategy.includes('activation');
      const isSocial = campaignStrategy.includes('social') || 
                       campaignStrategy.includes('community') || 
                       campaignStrategy.includes('user generated');
      
      if ((input.campaignStyle === 'digital' && isDigital) ||
          (input.campaignStyle === 'experiential' && isExperiential) ||
          (input.campaignStyle === 'social' && isSocial)) {
        dimensionScores.style = 10;
      }
    }
    
    // Sentiment analysis match (0-10 points)
    const campaignSentiment = determineSentiment(campaign.emotionalAppeal);
    if (inputSentiment === campaignSentiment) {
      dimensionScores.sentiment = 10;
    } else if (
      (inputSentiment === 'neutral' && campaignSentiment !== 'neutral') || 
      (campaignSentiment === 'neutral' && inputSentiment !== 'neutral')
    ) {
      dimensionScores.sentiment = 5;
    }
    
    // Tone match (0-10 points)
    const campaignTone = determineTone(campaign.objectives, campaign.emotionalAppeal);
    if (inputTone === campaignTone) {
      dimensionScores.tone = 10;
    } else {
      // Some tones are more compatible than others
      const toneCompatibility: Record<ToneCategory, Record<ToneCategory, number>> = {
        'formal': { 'casual': 3, 'humorous': 1, 'serious': 7, 'inspirational': 5, 'formal': 10 },
        'casual': { 'formal': 3, 'humorous': 7, 'serious': 3, 'inspirational': 5, 'casual': 10 },
        'humorous': { 'formal': 1, 'casual': 7, 'serious': 1, 'inspirational': 3, 'humorous': 10 },
        'serious': { 'formal': 7, 'casual': 3, 'humorous': 1, 'inspirational': 5, 'serious': 10 },
        'inspirational': { 'formal': 5, 'casual': 5, 'humorous': 3, 'serious': 5, 'inspirational': 10 }
      };
      
      dimensionScores.tone = toneCompatibility[inputTone][campaignTone];
    }
    
    // Calculate total score
    const totalScore = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0);
    
    return {
      campaign,
      totalScore,
      dimensionScores
    };
  });
  
  // Use dimension diversity for selection
  // First, get top 10 by total score
  const topScoring = scoredCampaigns
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10);
  
  // Then, select 3 campaigns that maximize diversity across dimensions
  const selected: EnhancedSimilarityScore[] = [];
  
  // Always include the highest scoring campaign
  selected.push(topScoring[0]);
  
  // For the next selections, prefer campaigns that are strong in dimensions
  // where currently selected campaigns are weaker
  while (selected.length < 3 && selected.length < topScoring.length) {
    // Calculate average dimension scores for currently selected campaigns
    const avgDimensionScores: Record<string, number> = {};
    Object.keys(topScoring[0].dimensionScores).forEach(dimension => {
      avgDimensionScores[dimension] = selected.reduce(
        (sum, item) => sum + item.dimensionScores[dimension as keyof typeof item.dimensionScores], 
        0
      ) / selected.length;
    });
    
    // Find campaign that's strong where current selection is weak
    let bestComplement: EnhancedSimilarityScore | null = null;
    let bestComplementScore = -1;
    
    for (const candidate of topScoring) {
      // Skip if already selected
      if (selected.some(s => s.campaign.id === candidate.campaign.id)) {
        continue;
      }
      
      // Calculate how well this candidate complements existing selection
      let complementScore = 0;
      Object.entries(avgDimensionScores).forEach(([dimension, avgScore]) => {
        const dimensionKey = dimension as keyof typeof candidate.dimensionScores;
        // If we're weak in this dimension and candidate is strong, that's good
        if (avgScore < 7 && candidate.dimensionScores[dimensionKey] > avgScore) {
          complementScore += (candidate.dimensionScores[dimensionKey] - avgScore);
        }
      });
      
      if (complementScore > bestComplementScore) {
        bestComplementScore = complementScore;
        bestComplement = candidate;
      }
    }
    
    // If we found a good complement, add it; otherwise just take next highest scoring
    if (bestComplement) {
      selected.push(bestComplement);
    } else {
      const nextBest = topScoring.find(
        candidate => !selected.some(s => s.campaign.id === candidate.campaign.id)
      );
      if (nextBest) {
        selected.push(nextBest);
      }
    }
  }
  
  console.log('Enhanced campaign selection:', selected.map(s => ({
    name: s.campaign.name,
    score: s.totalScore,
    dimensions: s.dimensionScores
  })));
  
  return selected.map(s => s.campaign);
};

/**
 * Creates a detailed prompt for OpenAI to generate a creative campaign
 */
const createCampaignPrompt = (input: CampaignInput, referenceCampaigns: Campaign[]): string => {
  const referenceCampaignsText = referenceCampaigns.map(campaign => {
    return `
Campaign Name: ${campaign.name}
Brand: ${campaign.brand}
Industry: ${campaign.industry}
Target Audience: ${campaign.targetAudience.join(', ')}
Objectives: ${campaign.objectives.join(', ')}
Key Message: ${campaign.keyMessage}
Strategy: ${campaign.strategy}
Emotional Appeal: ${campaign.emotionalAppeal.join(', ')}
`;
  }).join('\n');

  return `Generate a creative marketing campaign for the following brand and requirements:

BRAND INFORMATION:
Brand Name: ${input.brand}
Industry: ${input.industry}
Target Audience: ${input.targetAudience.join(', ')}
Campaign Objectives: ${input.objectives.join(', ')}
Emotional Appeal to Focus On: ${input.emotionalAppeal.join(', ')}
Campaign Style: ${input.campaignStyle || 'Any (digital, experiential, or social)'}
${input.additionalConstraints ? `Additional Requirements: ${input.additionalConstraints}` : ''}

REFERENCE CAMPAIGNS FOR INSPIRATION:
${referenceCampaignsText}

Please create a comprehensive campaign with the following components:
1. A creative and memorable campaign name
2. A powerful key message that resonates with the target audience
3. Three innovative creative strategy points
4. Five detailed execution plan items
5. Four expected outcomes or KPIs

Format your response as JSON in the following structure:
{
  "campaignName": "Name of Campaign",
  "keyMessage": "The key message",
  "creativeStrategy": ["Strategy point 1", "Strategy point 2", "Strategy point 3"],
  "executionPlan": ["Execution item 1", "Execution item 2", "Execution item 3", "Execution item 4", "Execution item 5"],
  "expectedOutcomes": ["Outcome 1", "Outcome 2", "Outcome 3", "Outcome 4"]
}

Make the campaign innovative, impactful, and aligned with current marketing trends. Ensure it addresses the specific objectives and connects emotionally with the target audience.`;
};

/**
 * Extracts JSON from a potentially markdown-formatted string
 * This handles cases where OpenAI returns JSON wrapped in markdown code blocks
 */
const extractJsonFromResponse = (text: string): string => {
  // Check if the response is wrapped in markdown code blocks
  const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/;
  const match = text.match(jsonRegex);
  
  // If we found a JSON block in markdown format, extract it
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // Otherwise return the original text
  return text.trim();
};

// Main function to generate a campaign
export const generateCampaign = async (
  input: CampaignInput, 
  openAIConfig: OpenAIConfig = defaultOpenAIConfig
): Promise<GeneratedCampaign> => {
  try {
    // Find similar reference campaigns with enhanced scoring
    const referenceCampaigns = findSimilarCampaigns(input);
    
    // Create a detailed prompt for OpenAI
    const prompt = createCampaignPrompt(input, referenceCampaigns);
    
    // Generate campaign using OpenAI
    const response = await generateWithOpenAI(prompt, openAIConfig);
    
    // Clean the response to extract just the JSON
    const cleanedResponse = extractJsonFromResponse(response);
    
    // Parse the JSON response
    const generatedContent = JSON.parse(cleanedResponse);
    
    // Return the campaign with references
    return {
      ...generatedContent,
      referenceCampaigns
    };
  } catch (error) {
    console.error("Error generating campaign:", error);
    throw error;
  }
};
