import { GeneratedCampaign } from './types';
import { OpenAIConfig, generateWithOpenAI } from '../openai';

export interface CampaignEvaluation {
  strengths: string[];
  opportunities: string[];
  risks: string[];
  overallScore: number;
  braveryScore?: number;
}

export interface FeedbackCriterion {
  aspect: string;
  question: string;
  scale: string;
}

export const evaluateCampaign = async (campaign: GeneratedCampaign, openAIConfig: OpenAIConfig): Promise<CampaignEvaluation> => {
  const feedbackCriteria: FeedbackCriterion[] = [
    {
      aspect: "Brand Alignment",
      question: "How well does the campaign align with the brand's values and identity?",
      scale: "1-10"
    },
    {
      aspect: "Target Audience Resonance",
      question: "How likely is the campaign to resonate with the target audience?",
      scale: "1-10"
    },
    {
      aspect: "Creative Innovation",
      question: "How innovative and original is the creative approach?",
      scale: "1-10"
    },
    {
      aspect: "Strategic Clarity",
      question: "How clear and effective is the overall campaign strategy?",
      scale: "1-10"
    },
    {
      aspect: "Execution Feasibility",
      question: "How feasible is the execution plan, considering budget and resources?",
      scale: "1-10"
    }
  ];
  
  try {
    const prompt = `
You are an experienced marketing strategist providing constructive feedback on a campaign.
Evaluate the following campaign based on these criteria:
${feedbackCriteria.map(criterion => `- ${criterion.aspect}: ${criterion.question} (Scale: ${criterion.scale})`).join('\n')}

Campaign Details:
- Campaign Name: ${campaign.campaignName}
- Key Message: ${campaign.keyMessage}
- Brand: ${campaign.brand}
- Strategy: ${campaign.strategy}
- Creative Strategy: ${campaign.creativeStrategy.join(', ')}
- Execution Plan: ${campaign.executionPlan.join(', ')}
- Viral Element: ${campaign.viralElement}
- Consumer Interaction: ${campaign.consumerInteraction}
- Call to Action: ${campaign.callToAction}

Provide your evaluation in JSON format with these keys: strengths, opportunities, risks, overallScore.
The overallScore is an integer from 1-10.
Include a braveryScore based on the campaign's calculated bravery.

Example:
{
  "strengths": ["Clear brand positioning", "Strong emotional appeal"],
  "opportunities": ["Further differentiation", "More innovative execution"],
  "risks": ["Execution complexity", "Potential audience misunderstanding"],
  "overallScore": 7,
  "braveryScore": 6
}
`;
    
    const evaluationResponse = await generateWithOpenAI(prompt, openAIConfig);
    
    try {
      const parsedEvaluation = JSON.parse(evaluationResponse);
      return {
        strengths: parsedEvaluation.strengths || [],
        opportunities: parsedEvaluation.opportunities || [],
        risks: parsedEvaluation.risks || [],
        overallScore: parsedEvaluation.overallScore || 7,
        braveryScore: campaign.braveryScores?.totalScore || 5
      };
    } catch (error) {
      console.error("Error parsing evaluation response:", error);
      // Fallback with default values
      return {
        strengths: ["Clear brand positioning", "Strong emotional appeal"],
        opportunities: ["Further differentiation", "More innovative execution"],
        risks: ["Execution complexity", "Potential audience misunderstanding"],
        overallScore: 7,
        braveryScore: campaign.braveryScores?.totalScore || 5
      };
    }
  } catch (error) {
    console.error("Error evaluating campaign:", error);
    return {
      strengths: ["Clear brand positioning", "Strong emotional appeal"],
      opportunities: ["Further differentiation", "More innovative execution"],
      risks: ["Execution complexity", "Potential audience misunderstanding"],
      overallScore: 7,
      braveryScore: campaign.braveryScores?.totalScore || 5
    };
  }
};
