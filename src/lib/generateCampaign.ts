
import { Campaign, campaignData } from './campaignData';

export interface CampaignInput {
  brand: string;
  industry: string;
  targetAudience: string[];
  objectives: string[];
  emotionalAppeal: string[];
  additionalConstraints?: string;
}

export interface GeneratedCampaign {
  campaignName: string;
  keyMessage: string;
  creativeStrategy: string[];
  executionPlan: string[];
  expectedOutcomes: string[];
  referenceCampaigns: Campaign[];
}

// Helper function to get random items from an array
const getRandomItems = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to find similar campaigns based on input
const findSimilarCampaigns = (input: CampaignInput): Campaign[] => {
  // Score each campaign based on similarities
  const scoredCampaigns = campaignData.map(campaign => {
    let score = 0;
    
    // Match industry
    if (campaign.industry.toLowerCase() === input.industry.toLowerCase()) {
      score += 3;
    }
    
    // Match target audience (partial matches)
    input.targetAudience.forEach(audience => {
      if (campaign.targetAudience.some(a => a.toLowerCase().includes(audience.toLowerCase()))) {
        score += 2;
      }
    });
    
    // Match objectives (partial matches)
    input.objectives.forEach(objective => {
      if (campaign.objectives.some(o => o.toLowerCase().includes(objective.toLowerCase()))) {
        score += 2;
      }
    });
    
    // Match emotional appeal
    input.emotionalAppeal.forEach(emotion => {
      if (campaign.emotionalAppeal.some(e => e.toLowerCase().includes(emotion.toLowerCase()))) {
        score += 2;
      }
    });
    
    return { campaign, score };
  });
  
  // Sort by score and take top 3
  return scoredCampaigns
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(sc => sc.campaign);
};

// Create execution plan based on input and reference campaigns
const createExecutionPlan = (input: CampaignInput, referenceCampaigns: Campaign[]): string[] => {
  const executionPlans = [
    // Digital focused
    `Social media campaign across ${getRandomItems(['Instagram', 'TikTok', 'Twitter', 'Facebook', 'LinkedIn', 'YouTube'], 3).join(', ')}`,
    `Influencer partnerships with ${input.targetAudience[0]} influencers`,
    `Interactive website experience with user-generated content`,
    `Email marketing campaign with personalized stories`,
    
    // Traditional media
    `30-second TV commercial highlighting the key message`,
    `Print advertisements in ${input.targetAudience[0]}-focused publications`,
    `Out-of-home advertising in major metropolitan areas`,
    `Radio spots during ${input.targetAudience[0]}-focused programming`,
    
    // Experiential
    `Pop-up experiences in key markets`,
    `Immersive in-store activations`,
    `Brand partnerships with complementary ${input.industry} companies`,
    `Interactive AR/VR experience accessible via mobile app`,
    
    // Content-focused
    `Documentary-style content series`,
    `Podcast series exploring ${input.emotionalAppeal[0]} stories`,
    `Interactive data visualization`,
    `User-generated content competition`,
    
    // Community-focused
    `Community-building events in key markets`,
    `Charitable initiative supporting ${input.emotionalAppeal[0]}-related causes`,
    `Online community platform for ${input.targetAudience[0]}`,
    `Ambassador program for passionate ${input.brand} customers`
  ];
  
  // Get features from reference campaigns and add some of them
  const referenceFeatures = referenceCampaigns.flatMap(camp => camp.features);
  
  // Combine some reference features with new ideas
  const plans = [
    ...getRandomItems(executionPlans, 3),
    ...getRandomItems(referenceFeatures, 2)
  ];
  
  // Make sure we have 3-5 execution plans
  return plans.slice(0, Math.min(5, Math.max(3, plans.length)));
};

// Generate creative strategy based on input and reference campaigns
const createCreativeStrategy = (input: CampaignInput, referenceCampaigns: Campaign[]): string[] => {
  const strategies = [
    `Leverage ${input.emotionalAppeal[0]} through authentic storytelling`,
    `Create a social movement around ${input.objectives[0]}`,
    `Use data visualization to highlight ${input.brand}'s impact on ${input.targetAudience[0]}`,
    `Develop a brand character that embodies ${input.emotionalAppeal[0]}`,
    `Partner with ${input.targetAudience[0]} influencers to create authentic content`,
    `Launch a challenge that encourages ${input.targetAudience[0]} to share their ${input.emotionalAppeal[0]} moments`,
    `Create an interactive experience that lets users explore ${input.brand}'s commitment to ${input.objectives[0]}`,
    `Use humor to break down barriers around ${input.industry} topics`,
    `Develop a serialized content series that follows ${input.targetAudience[0]} on their journey`,
    `Use AI technology to create personalized ${input.emotionalAppeal[0]} experiences`,
    `Create a limited-edition product that embodies ${input.emotionalAppeal[0]}`,
    `Launch a co-creation initiative with ${input.targetAudience[0]} community`,
  ];
  
  // Get strategies from reference campaigns and adapt them
  const referenceStrategies = referenceCampaigns.map(camp => 
    camp.strategy.replace(camp.brand, input.brand)
                .replace(/their [a-z]+ audience/i, `${input.targetAudience[0]}`)
  );
  
  // Combine some strategies with reference strategies
  const combinedStrategies = [
    ...getRandomItems(strategies, 2),
    ...getRandomItems(referenceStrategies, 1)
  ];
  
  return combinedStrategies.slice(0, 3);
};

// Generate expected outcomes based on input and reference campaigns
const createExpectedOutcomes = (input: CampaignInput, referenceCampaigns: Campaign[]): string[] => {
  const outcomes = [
    `Increased brand awareness among ${input.targetAudience[0]}`,
    `Higher engagement rates across social media platforms`,
    `Improved brand perception related to ${input.emotionalAppeal[0]}`,
    `Growth in market share within ${input.industry} sector`,
    `Increased customer loyalty and retention`,
    `Higher conversion rates from campaign touchpoints`,
    `Positive press coverage highlighting ${input.brand}'s innovation`,
    `Strengthened emotional connection with ${input.targetAudience[0]}`,
    `Increased website traffic and time spent on site`,
    `Growth in user-generated content related to the campaign`,
    `New audience acquisition in the ${input.targetAudience[0]} segment`,
    `Establishment of ${input.brand} as a leader in ${input.emotionalAppeal[0]} within ${input.industry}`
  ];
  
  // Get outcomes from reference campaigns
  const referenceOutcomes = referenceCampaigns.flatMap(camp => camp.outcomes);
  
  // Combine outcomes
  const combinedOutcomes = [
    ...getRandomItems(outcomes, 3),
    ...getRandomItems(referenceOutcomes, 1)
  ];
  
  return [...new Set(combinedOutcomes)].slice(0, 4);
};

// Generate campaign name
const generateCampaignName = (input: CampaignInput, referenceCampaigns: Campaign[]): string => {
  const nameTemplates = [
    `${input.brand} ${input.emotionalAppeal[0]}`,
    `The ${input.emotionalAppeal[0]} Project`,
    `${input.brand}: ${input.emotionalAppeal[0]} Matters`,
    `${input.emotionalAppeal[0]} ${input.targetAudience[0]}`,
    `${input.brand} ${input.emotionalAppeal[0]} Movement`,
    `${input.emotionalAppeal[0]} Journey`,
    `The ${input.brand} Experience`,
    `${input.brand} for ${input.targetAudience[0]}`,
    `${input.emotionalAppeal[0]} Revolution`,
    `${input.brand} ${input.objectives[0]} Initiative`,
    `${input.emotionalAppeal[0]} Stories`,
    `${input.brand} Presents: ${input.emotionalAppeal[0]}`,
    `${input.targetAudience[0]} First`,
    `${input.brand} Reimagined`,
    `The New ${input.brand}`,
  ];
  
  // Get a random name template
  return getRandomItems(nameTemplates, 1)[0];
};

// Generate key message
const generateKeyMessage = (input: CampaignInput, referenceCampaigns: Campaign[]): string => {
  const messageTemplates = [
    `Experience ${input.emotionalAppeal[0]} like never before`,
    `${input.brand}: Where ${input.emotionalAppeal[0]} meets ${input.objectives[0]}`,
    `Your ${input.emotionalAppeal[0]} journey starts with ${input.brand}`,
    `${input.brand}: Made for ${input.targetAudience[0]}`,
    `Redefine ${input.industry} with ${input.brand}`,
    `${input.emotionalAppeal[0]} is in our DNA`,
    `${input.brand}: The choice for ${input.targetAudience[0]}`,
    `${input.emotionalAppeal[0]} without compromise`,
    `${input.brand} - Because ${input.emotionalAppeal[0]} matters`,
    `The future of ${input.industry} is ${input.emotionalAppeal[0]}`,
    `${input.emotionalAppeal[0]} starts here`,
    `${input.brand}: Where ${input.targetAudience[0]} belongs`,
  ];
  
  // Get reference messages and adapt them
  const referenceMessages = referenceCampaigns.map(camp => 
    camp.keyMessage.replace(camp.brand, input.brand)
                   .replace(new RegExp(camp.emotionalAppeal[0], 'i'), input.emotionalAppeal[0])
  );
  
  // Get messages
  const messages = [
    ...getRandomItems(messageTemplates, 3),
    ...getRandomItems(referenceMessages, 1)
  ];
  
  return getRandomItems(messages, 1)[0];
};

// Main function to generate a campaign
export const generateCampaign = (input: CampaignInput): GeneratedCampaign => {
  // Find similar reference campaigns
  const referenceCampaigns = findSimilarCampaigns(input);
  
  return {
    campaignName: generateCampaignName(input, referenceCampaigns),
    keyMessage: generateKeyMessage(input, referenceCampaigns),
    creativeStrategy: createCreativeStrategy(input, referenceCampaigns),
    executionPlan: createExecutionPlan(input, referenceCampaigns),
    expectedOutcomes: createExpectedOutcomes(input, referenceCampaigns),
    referenceCampaigns
  };
};
