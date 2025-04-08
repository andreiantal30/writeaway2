
// Re-export everything from campaign/generateCampaign.ts and types for backward compatibility
export { 
  generateCampaign,
  applyEmotionalRebalance,
  calculateBraveryMatrix
} from './campaign/generateCampaign';

export type {
  CampaignInput,
  GeneratedCampaign,
  CampaignVersion,
  CampaignEvaluation,
  InsightScores,
  CreativeInsights,
  BraveryScores,
  StorytellingOutput
} from './campaign/types';
