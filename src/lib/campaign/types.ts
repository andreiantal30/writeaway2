
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

// Complete GeneratedCampaign type that merges all properties needed across the app
export interface GeneratedCampaign {
  // Core campaign elements
  campaignName: string;
  keyMessage: string; // Added to match components expecting this field
  brand: string; // Added to match components expecting this field
  strategy: string;
  executionPlan: string[];
  viralElement: string;
  viralHook?: string; // Legacy support
  prHeadline: string;
  consumerInteraction: string;
  callToAction: string;
  
  // Creative elements
  creativeInsights: any;
  emotionalAppeal?: string[]; // Added for UI components
  creativeStrategy?: string[]; // Added for UI components
  
  // Campaign extensions
  expectedOutcomes?: string[]; // Added for UI components
  referenceCampaigns?: any[];
  storytelling?: StorytellingOutput;
  evaluation?: CampaignEvaluation;
  narrativeAnchor?: string;
  executionFilterRationale?: string;
  insightScores?: InsightScores;
  versionTag?: string;
}
