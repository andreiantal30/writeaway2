export interface Campaign {
    id: string;
    name: string;
    brand: string;
    year: number;
    industry: string;
    targetAudience: string[];
    objectives: string[];
    keyMessage: string;
    strategy: string;
    features: string[];
    emotionalAppeal: string[];
    outcomes: string[];
    creativeActivation?: string;
    viralElement?: string;
  }
  