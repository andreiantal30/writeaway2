
// Campaign input collected from the user
export interface CampaignInput {
  brand: string;
  industry: string;
  targetAudience: string[];
  objectives?: string[];
  emotionalAppeal: string[];
  campaignStyle?: string;
  brandPersonality?: string;
  differentiator?: string;
  additionalConstraints?: string;
  creativeLens?: string;
  persona?: string;
  culturalInsights?: string;
}

// Creative insights structure
export interface CreativeInsights {
  surfaceInsight: string;
  emotionalUndercurrent: string;
  creativeUnlock: string;
}

// Import the standardized campaign type from the campaign module
import { GeneratedCampaign, CampaignEvaluation, CampaignVersion, InsightScores } from '../lib/campaign/types';

// StorytellingOutput interface
export interface StorytellingOutput {
  hook: string;
  protagonist: string;
  conflict: string;
  journey: string;
  resolution: string;
  fullNarrative: string;
}

// Re-export the imported types for backward compatibility
export type { 
  GeneratedCampaign,
  CampaignEvaluation,
  CampaignVersion,
  InsightScores
};

// Reference campaign format
export interface ReferenceCampaign {
  id: string;
  name: string;
  brand: string;
  industry: string;
  description: string;
  strategy: string;
  targetAudience: string[];
  emotionalAppeal: string[];
  objectives: string[];
  creativeActivation?: string;
  results?: string;
  awards?: string[];
  year?: number;
}

// Creative device to enhance campaigns
export interface CreativeDevice {
  id: string;
  name: string;
  description: string;
  examples: string[];
  applicableTo: string[];
}

// Cultural trend data from external sources
export interface CulturalTrend {
  id: string;
  title: string;
  description: string;
  source: string;
  platformTags: string[];
  category: string;
  addedOn: Date;
}
