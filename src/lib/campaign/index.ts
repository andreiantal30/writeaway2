
// Re-export everything from specific modules (with more precise exports to avoid conflicts)
export type { 
  GeneratedCampaign,
  CampaignVersion,
  CampaignEvaluation,
  InsightScores,
  CreativeInsights,
  BraveryScores,
  StorytellingOutput
} from './types';

// Re-export CampaignInput from the central location
export type { CampaignInput } from '../types/campaign';

export { generateCampaign } from './generateCampaign';
export { calculateBraveryMatrix } from './calculateBraveryMatrix';
export { applyEmotionalRebalance } from './emotionalRebalance';

// Re-export other campaign modules
export * from './campaignMatcher';
export * from './creativeInsightGenerator';
export * from './storytellingGenerator';
export * from './strategyBooster';
export * from './narrativeAnchor';
export * from './executionFilters';
export * from './campaignPromptBuilder';
export * from './evaluateCampaign';
export * from './utils';
