
import OpenAI from 'openai';

type CampaignOutput = {
  campaignName: string;
  keyMessage: string;
  strategy: string;
  executionPlan: string[];
  viralElement: string;
  prHeadline: string;
  consumerInteraction: string;
  callToAction: string;
  creativeInsights: {
    surfaceInsight: string;
    emotionalUndercurrent: string;
    creativeUnlock: string;
  };
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function applyCreativeDirectorPass(generatedCampaign: CampaignOutput): Promise<CampaignOutput> {
  const prompt = `
You are a Cannes Lions-winning Creative Director. Improve this marketing campaign with sharper naming, cultural tension, emotional storytelling, and creative boldness.

Your task is to:
1. Sharpen the campaign name to be more distinctive and memorable
2. Inject cultural tension into the strategy and insights
3. Make the execution plan more distinctive with specific details
4. Add emotional storytelling elements to make it more resonant
5. Make the viral element more surprising and shareworthy
6. Ensure the PR headline is genuinely news-worthy
7. Make the consumer interaction more participatory
8. Sharpen the call to action for greater impact

Keep the format and structure the same. Do not return explanations—just the final JSON.

CAMPAIGN:
\`\`\`json
${JSON.stringify(generatedCampaign, null, 2)}
\`\`\`
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const raw = response.choices?.[0]?.message?.content || '{}';
  
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error parsing CD pass response:", error);
    
    // Try to extract JSON if it's wrapped in markdown code blocks
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (innerError) {
        console.error("Error parsing extracted JSON:", innerError);
      }
    }
    
    // If all else fails, return the original
    return generatedCampaign;
  }
}
