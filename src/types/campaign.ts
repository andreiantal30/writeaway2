
// Campaign input collected from the user
export interface CampaignInput {
  brand: string;
  industry: string;
  targetAudience: string[];
  objectives: string[];
  emotionalAppeal: string[];
  campaignStyle?: string;
  brandPersonality?: string;
  differentiator?: string;
  additionalConstraints?: string;
  creativeLens?: string;
  persona?: string;
}

// Creative insights structure
export interface CreativeInsights {
  surfaceInsight: string;
  emotionalUndercurrent: string;
  creativeUnlock: string;
}

// The final generated campaign output
export interface GeneratedCampaign {
  campaignName: string;
  brand: string;
  strategy: string;
  executionPlan: string[];
  viralElement: string;
  prHeadline: string;
  consumerInteraction: string;
  callToAction: string;
  creativeInsights: CreativeInsights;
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
