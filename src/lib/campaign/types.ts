
import { ReferenceCampaign, CampaignInput } from "../../types/campaign";

// Creative insights generated for a campaign
export interface CreativeInsights {
  surfaceInsight: string;
  emotionalUndercurrent: string;
  creativeUnlock: string;
}

// Campaign evaluation
export interface CampaignEvaluation {
  strengths: string[];
  opportunities: string[];
  risks: string[];
  overallScore: number;
  braveryScore?: number;
}

// Insight scoring system
export interface InsightScores {
  insight1: { contradiction: number; irony: number; tension: number };
  insight2: { contradiction: number; irony: number; tension: number };
  insight3: { contradiction: number; irony: number; tension: number };
}

// Campaign version tracking
export interface CampaignVersion {
  id: string;
  versionTag: string;
  timestamp: number;
  campaign: GeneratedCampaign;
}

// Bravery scores for campaign execution plan
export interface BraveryScores {
  physicality: number;
  risk: number;
  culturalTension: number;
  novelty: number;
  totalScore: number;
}

// Storytelling output interface - updated to ensure all required fields are present
export interface StorytellingOutput {
  // Required core fields
  narrative: string;
  hook: string;
  protagonist: string;
  conflict: string;
  journey: string;
  resolution: string;
  fullNarrative: string;
  
  // Extended fields (optional)
  storyNarrative?: string;
  protagonistDescription?: string;
  conflictDescription?: string;
  resolutionDescription?: string;
  brandValueConnection?: string;
  audienceRelevance?: string;
}

// Complete generated campaign with all components
export interface GeneratedCampaign {
  campaignName: string;
  keyMessage: string;
  brand: string;
  strategy: string;
  creativeStrategy: string[];
  executionPlan: string[];
  viralElement: string;
  prHeadline: string;
  consumerInteraction: string;
  callToAction: string;
  creativeInsights: CreativeInsights;
  emotionalAppeal: string[];
  referenceCampaigns: ReferenceCampaign[];
  expectedOutcomes: string[];
  storytelling?: StorytellingOutput;
  evaluation?: CampaignEvaluation;
  narrativeAnchor?: {
    anchors: string[];
    rationale: string;
  };
  executionFilterRationale?: string;
  insightScores?: InsightScores;
  braveryScores?: BraveryScores;
  viralHook?: string; // Added for compatibility with existing code
  _cdModifications?: string[]; // For tracking creative director modifications
}

// Exporting the CampaignInput type from the central location
export type { CampaignInput };
