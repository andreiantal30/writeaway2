
import { StorytellingOutput } from './storytellingGenerator';

export interface CampaignInput {
  brand: string;
  industry: string;
  targetAudience: string[];
  objectives: string[];
  emotionalAppeal: string[];
  additionalConstraints?: string;
  brandPersonality?: string;
  differentiator?: string;
  culturalInsights?: string;
  campaignStyle?: string; // Changed from enum to string for compatibility
  persona?: string;
  creativeLens?: string;
}

export interface FeedbackCriterion {
  score: number;
  comment: string;
}

export interface CampaignEvaluation {
  insightSharpness: FeedbackCriterion;
  ideaOriginality: FeedbackCriterion;
  executionPotential: FeedbackCriterion;
  awardPotential: FeedbackCriterion;
  finalVerdict: string;
}

export interface InsightScores {
  insight1: {
    contradiction: number;
    irony: number;
    tension: number;
  };
  insight2: {
    contradiction: number;
    irony: number;
    tension: number;
  };
  insight3: {
    contradiction: number;
    irony: number;
    tension: number;
  };
}

export interface CampaignVersion {
  id: string;
  versionTag: string;
  timestamp: number;
  campaign: GeneratedCampaign;
}

// Creative insights structure
export interface CreativeInsights {
  surfaceInsight: string;
  emotionalUndercurrent: string;
  creativeUnlock: string;
}

// The final generated campaign output - standardized across backend and frontend
export interface GeneratedCampaign {
  // Core campaign elements
  campaignName: string;
  keyMessage: string;
  brand: string;
  strategy: string;
  executionPlan: string[];
  viralElement: string;
  viralHook?: string; // Legacy support
  prHeadline: string;
  consumerInteraction: string;
  callToAction: string;
  
  // Creative elements
  creativeInsights: CreativeInsights;
  emotionalAppeal: string[]; // Required for UI components
  creativeStrategy: string[]; // Required for UI components
  
  // Campaign extensions
  expectedOutcomes?: string[]; // Optional but used in UI components
  referenceCampaigns?: any[];
  storytelling?: StorytellingOutput;
  evaluation?: CampaignEvaluation;
  narrativeAnchor?: string;
  executionFilterRationale?: string;
  insightScores?: InsightScores;
  versionTag?: string;
}
