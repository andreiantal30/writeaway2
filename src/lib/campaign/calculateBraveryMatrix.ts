
import { GeneratedCampaign } from './types';

export interface BraveryScores {
  physicality: number;
  risk: number;
  culturalTension: number;
  novelty: number;
  totalScore: number;
}

/**
 * Calculates the bravery scores for a campaign execution plan
 * 
 * Evaluates each execution idea on:
 * - Physicality: How tangible/physical vs digital/virtual
 * - Risk: Potential downsides or controversy
 * - Cultural Tension: How it plays with or against cultural norms
 * - Novelty: How innovative/original it is
 */
export const calculateBraveryMatrix = (campaign: GeneratedCampaign): BraveryScores => {
  // Default medium scores if campaign or execution plan is missing
  if (!campaign || !campaign.executionPlan || campaign.executionPlan.length === 0) {
    return {
      physicality: 5,
      risk: 5,
      culturalTension: 5,
      novelty: 5,
      totalScore: 5
    };
  }

  // Create a single text block from all execution items for analysis
  const executionText = campaign.executionPlan.join(" ").toLowerCase();
  
  // Physical execution indicators
  const physicalityIndicators = [
    "installation", "event", "physical", "pop-up", "booth", "exhibit", "billboard", 
    "retail", "product", "public space", "street", "material", "packaging", "print",
    "outdoor", "display", "wearable", "experiential", "immersive", "live", "real-world"
  ];
  
  // Risk indicators
  const riskIndicators = [
    "controversy", "provocative", "challenge", "disrupt", "stunt", "guerrilla", 
    "shocking", "unprecedented", "bold", "daring", "subversive", "activist", 
    "political", "debate", "taboo", "break", "defy", "forbidden", "radical"
  ];
  
  // Cultural tension indicators
  const culturalTensionIndicators = [
    "culture", "society", "conversation", "trend", "movement", "zeitgeist", "viral", 
    "social commentary", "stereotype", "norm", "traditional", "modern", "generation",
    "identity", "belief", "value", "question", "challenge", "redefine", "reshape"
  ];
  
  // Novelty indicators
  const noveltyIndicators = [
    "first-ever", "innovative", "groundbreaking", "new", "pioneering", "invention", 
    "revolutionary", "never-before", "original", "cutting-edge", "breakthrough", 
    "unique", "unexpected", "fresh", "emerging", "tech", "prototype", "futuristic"
  ];
  
  // Calculate scores by counting indicators in the execution text (max 10)
  const calculateScore = (indicators: string[]) => {
    let count = 0;
    indicators.forEach(indicator => {
      if (executionText.includes(indicator)) {
        count++;
      }
    });
    
    // Convert to a score out of 10, capping at 10
    return Math.min(Math.round((count / 5) * 10), 10);
  };
  
  // Calculate individual scores
  const physicality = calculateScore(physicalityIndicators);
  const risk = calculateScore(riskIndicators);
  const culturalTension = calculateScore(culturalTensionIndicators);
  const novelty = calculateScore(noveltyIndicators);
  
  // Calculate total score as weighted average
  // Higher weight on risk and novelty since these are more important for creative bravery
  const totalScore = Math.round(
    (physicality * 0.2 + risk * 0.3 + culturalTension * 0.2 + novelty * 0.3) * 10
  ) / 10;
  
  return {
    physicality,
    risk,
    culturalTension,
    novelty,
    totalScore
  };
};
