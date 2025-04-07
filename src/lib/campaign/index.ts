
// Re-export everything from specific modules (with more precise exports to avoid conflicts)
export type { 
  CampaignInput, 
  GeneratedCampaign,
  CampaignVersion,
  CampaignEvaluation,
  FeedbackCriterion,
  InsightScores
} from './types';

export { generateCampaign } from './generateCampaign';

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
