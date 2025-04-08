
import { ReferenceCampaign } from "../../types/campaign";

// Input for generating a campaign
export interface CampaignInput {
  brand: string;
  industry: string;
  targetAudience: string[];
  emotionalAppeal: string[];
  objectives?: string[];
  campaignStyle?: string;
  brandPersonality?: string;
  differentiator?: string;
  additionalConstraints?: string;
  creativeLens?: string;
  persona?: string;
  culturalInsights?: string;
}

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
  storytelling?: {
    hook: string;
    protagonist: string;
    conflict: string;
    journey: string;
    resolution: string;
    fullNarrative: string;
  };
  evaluation?: CampaignEvaluation;
  narrativeAnchor?: {
    anchors: string[];
    rationale: string;
  };
  executionFilterRationale?: string;
  insightScores?: InsightScores;
  braveryScores?: BraveryScores;
}
