
import { GeneratedCampaign } from './types';

// Types for the bravery matrix
export interface BraveryScores {
  physicality: number;
  risk: number;
  culturalTension: number;
  novelty: number;
  totalScore: number;
}

// Word lists for each category
const physicalityWords = [
  'occupy', 'install', 'build', 'construct', 'physical', 'tangible', 'touch', 'intervention',
  'public space', 'street', 'outdoor', 'sculpture', 'monument', 'exhibit', 'installation'
];

const riskWords = [
  'ceo', 'government', 'disrupt', 'protest', 'confrontation', 'challenge', 'risky', 'bold',
  'provocative', 'controversial', 'lawsuit', 'legal', 'backlash', 'criticism', 'scandal', 'expose'
];

const personalRiskWords = [
  'confess', 'embarrass', 'reveal', 'vulnerable', 'personal', 'intimate', 'secret', 'shame',
  'emotion', 'fear', 'anxiety', 'uncomfortable', 'private', 'sensitive', 'expose'
];

const culturalTensionWords = [
  'gender', 'privilege', 'greenwash', 'cultural', 'social', 'political', 'identity', 'race',
  'equity', 'justice', 'inequality', 'climate', 'environment', 'sustainability', 'debate',
  'controversy', 'tension', 'polarizing', 'divisive', 'activism'
];

const clichéFormatWords = [
  'tiktok challenge', 'viral challenge', 'tiktok', 'petition', 'hashtag campaign', 'traditional ad',
  'conventional', 'typical', 'standard', 'normal', 'usual', 'common', 'ordinary', 
  'social media post', 'influencer partnership'
];

/**
 * Calculate bravery scores for a campaign based on its execution plan
 */
export const calculateBraveryMatrix = (campaign: GeneratedCampaign): BraveryScores => {
  // Default scores
  const scores = {
    physicality: 0,
    risk: 0,
    culturalTension: 0,
    novelty: 0,
    totalScore: 0
  };
  
  // If there's no execution plan, return default scores
  if (!campaign.executionPlan || campaign.executionPlan.length === 0) {
    return scores;
  }
  
  // Combine all execution plan items into one string for analysis
  const executionText = campaign.executionPlan.join(' ').toLowerCase();
  
  // Check for words in each category
  const physicalityMatches = physicalityWords.filter(word => executionText.includes(word.toLowerCase())).length;
  const riskMatches = riskWords.filter(word => executionText.includes(word.toLowerCase())).length;
  const personalRiskMatches = personalRiskWords.filter(word => executionText.includes(word.toLowerCase())).length;
  const culturalTensionMatches = culturalTensionWords.filter(word => executionText.includes(word.toLowerCase())).length;
  const clichéMatches = clichéFormatWords.filter(word => executionText.includes(word.toLowerCase())).length;
  
  // Calculate scores for each category (0-10 scale)
  scores.physicality = Math.min(10, Math.round((physicalityMatches / 3) * 10));
  scores.risk = Math.min(10, Math.round(((riskMatches + personalRiskMatches) / 4) * 10));
  scores.culturalTension = Math.min(10, Math.round((culturalTensionMatches / 3) * 10));
  
  // Novelty is inverse of cliché (higher cliché = lower novelty)
  scores.novelty = Math.max(0, 10 - Math.min(10, Math.round((clichéMatches / 2) * 10)));
  
  // Boost novelty score if execution plan has 5+ items (indicating breadth of execution)
  if (campaign.executionPlan.length >= 5) {
    scores.novelty = Math.min(10, scores.novelty + 2);
  }
  
  // Strategy contributes to novelty
  if (campaign.strategy) {
    const strategyText = campaign.strategy.toLowerCase();
    if (strategyText.includes('innovative') || strategyText.includes('disrupt') || strategyText.includes('novel')) {
      scores.novelty = Math.min(10, scores.novelty + 1);
    }
  }
  
  // Calculate total score (weighted average)
  scores.totalScore = Math.round(
    (scores.physicality * 0.25 + 
     scores.risk * 0.25 + 
     scores.culturalTension * 0.25 + 
     scores.novelty * 0.25) * 10
  ) / 10;
  
  return scores;
};
