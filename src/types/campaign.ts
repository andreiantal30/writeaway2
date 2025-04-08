
// Campaign input collected from the user
export interface CampaignInput {
  brand: string;
  industry: string;
  targetAudience: string[];
  objectives: string[]; // Required to match usage in the codebase
  emotionalAppeal: string[];
  campaignStyle?: string;
  brandPersonality?: string;
  differentiator?: string;
  additionalConstraints?: string;
  creativeLens?: string;
  persona?: string;
  culturalInsights?: string;
}

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

// Import all campaign types from the campaign module
// but don't re-export with the same names to avoid duplicates
import {
  GeneratedCampaign as LibGeneratedCampaign,
  CampaignEvaluation as LibCampaignEvaluation,
  CampaignVersion as LibCampaignVersion,
  InsightScores as LibInsightScores,
  CreativeInsights as LibCreativeInsights,
  StorytellingOutput as LibStorytellingOutput,
  BraveryScores as LibBraveryScores
} from '../lib/campaign/types';

// Re-export with type aliases to maintain backward compatibility
// without creating duplicate declarations
export type {
  LibGeneratedCampaign as GeneratedCampaign,
  LibCampaignEvaluation as CampaignEvaluation,
  LibCampaignVersion as CampaignVersion,
  LibInsightScores as InsightScores,
  LibCreativeInsights as CreativeInsights,
  LibStorytellingOutput as StorytellingOutput,
  LibBraveryScores as BraveryScores
};
