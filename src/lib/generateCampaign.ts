
// Re-export everything from campaign/generateCampaign.ts and types for backward compatibility
export { 
  generateCampaign
} from './campaign/generateCampaign';

export { 
  applyEmotionalRebalance 
} from './campaign/emotionalRebalance';

export { 
  calculateBraveryMatrix 
} from './campaign/calculateBraveryMatrix';

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
