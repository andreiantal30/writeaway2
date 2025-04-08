
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

// Re-export the standardized campaign interfaces from the campaign module to avoid circular dependencies
import { 
  GeneratedCampaign, 
  CampaignEvaluation, 
  CampaignVersion, 
  InsightScores,
  CreativeInsights,
  StorytellingOutput,
  BraveryScores 
} from '../lib/campaign/types';

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

// Re-export types for backward compatibility
export type { 
  GeneratedCampaign,
  CampaignEvaluation,
  CampaignVersion,
  InsightScores,
  CreativeInsights,
  StorytellingOutput,
  BraveryScores
};
