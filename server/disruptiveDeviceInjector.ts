
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

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function injectDisruptiveDevice(campaign: CampaignOutput): Promise<CampaignOutput> {
  try {
    const prompt = `
You're a disruptive creative thinker. Review the following campaign and inject one unexpected creative twist that would make it more bold, viral, or culturally subversive.

Use techniques like:
- Hijacking rituals
- Breaking norms
- Turning the medium against itself
- Revealing hidden tensions
- Forcing participation
- Creating friction
- Adding elements of surprise or misdirection
- Introducing unexpected contexts or contrasts

First, identify the weakest elements of the campaign that could be improved, then add a bold genre-breaking twist that would elevate it to award-winning status.

Return the improved campaign in the same JSON format, rewriting only what's needed.

CAMPAIGN:
\`\`\`json
${JSON.stringify(campaign, null, 2)}
\`\`\`
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.85, // Higher temperature for more creative results
    });

    const raw = response.choices?.[0]?.message?.content || '{}';
    
    try {
      // Attempt to parse JSON directly
      return JSON.parse(raw);
    } catch (parseError) {
      console.error("Error parsing OpenAI response as JSON, attempting to extract JSON:", parseError);
      
      // Fallback: Try to extract JSON from the response
      const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/) || 
                        raw.match(/\{[\s\S]*\}/);
                        
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      } else if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // If all else fails, return the original campaign
      console.error("Could not extract valid JSON from response, returning original campaign");
      return campaign;
    }
  } catch (error) {
    console.error("Error in injectDisruptiveDevice:", error);
    return campaign; // Return the original campaign if there's an error
  }
}
