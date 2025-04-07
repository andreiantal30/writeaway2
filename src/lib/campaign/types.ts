
import { StorytellingOutput } from './storytellingGenerator';
import { ReferenceCampaign } from '../../types/campaign';

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
  campaignStyle?: 
    | "digital" 
    | "experiential" 
    | "social" 
    | "influencer" 
    | "guerrilla" 
    | "ugc" 
    | "brand-activism" 
    | "branded-entertainment" 
    | "retail-activation" 
    | "product-placement" 
    | "data-personalization" 
    | "real-time" 
    | "event-based" 
    | "ooh-ambient" 
    | "ai-generated" 
    | "co-creation" 
    | "stunt-marketing" 
    | "ar-vr" 
    | "performance" 
    | "loyalty-community"
    | "stunt"
    | "UGC";
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

export interface GeneratedCampaign {
  campaignName: string;
  keyMessage: string;
  strategy: string;
  executionPlan: string[];
  viralElement: string;
  prHeadline: string;
  consumerInteraction: string;
  callToAction: string;
  creativeInsights: any;
  referenceCampaigns?: ReferenceCampaign[];
  storytelling?: StorytellingOutput;
  evaluation?: CampaignEvaluation;
  narrativeAnchor?: string;
  executionFilterRationale?: string;
  insightScores?: InsightScores;
  versionTag?: string;
}
