import { CampaignInput } from './types';
import { Campaign } from '../campaignData';
import { formatCampaignForPrompt } from '@/utils/formatCampaignForPrompt';
import { getCreativePatternGuidance } from '@/utils/matchReferenceCampaigns';
import { getCreativeLensById } from '@/utils/creativeLenses';
import { CreativeDevice, formatCreativeDevicesForPrompt } from '@/data/creativeDevices';
import { CulturalTrend } from '@/data/culturalTrends';

export const createCampaignPrompt = (
  input: CampaignInput, 
  referenceCampaigns: Campaign[],
  creativeInsights: string[] = [],
  creativeDevices: CreativeDevice[] = [],
  culturalTrends: CulturalTrend[] = []
): string => {
  const referenceCampaignsText = referenceCampaigns.map(campaign => formatCampaignForPrompt(campaign)).join('\n');

  const insightsBlock = creativeInsights.length > 0 ? `
#### **Creative Insights**
The following audience insights have been identified as key tensions or truths that can drive powerful creative:

${creativeInsights.map((insight, index) => `${index + 1}. "${insight}"`).join('\n')}

Use at least one of these insights as a foundation for your campaign strategy.
` : '';

  const culturalTrendsBlock = culturalTrends.length > 0 ? `
#### **Cultural Trends**
The following cultural trends should be considered for your campaign:

${culturalTrends.map((trend, index) => `${index + 1}. "${trend.title}": ${trend.description}`).join('\n')}

Try to leverage one of these cultural trends to make your campaign more relevant and timely.
` : '';

  const referencePrompt = `
Use the following real-world award-winning campaigns as inspiration. These examples align with the target audience, emotional appeal, or strategy you're being asked to create for. Do not copy them, but analyze what makes them powerful, then build something fresh.

${referenceCampaignsText}
`;

  const awardPatterns = getCreativePatternGuidance();

  let campaignStyleDescription = input.campaignStyle || 'Any';
  const styleDescriptions: Record<string, string> = {
    'digital': 'Digital-first approach with highly shareable, interactive content',
    'experiential': 'Experiential marketing focused on real-world brand immersion',
    'social': 'Social-led approach optimized for engagement and virality',
    'influencer': 'Influencer-driven marketing leveraging creators & personalities',
    'guerrilla': 'Unexpected, disruptive guerrilla marketing activation',
    'stunt': 'Attention-grabbing PR stunt designed to generate buzz',
    'UGC': 'User-generated content strategy encouraging consumer participation',
    'brand-activism': 'Brand Activism – Focused on social or environmental causes',
    'branded-entertainment': 'Branded Entertainment – Storytelling through content',
    'retail-activation': 'Retail Activation – In-store experiences, pop-ups, and interactive retail moments',
    'product-placement': 'Product Placement & Integration – Subtle advertising in media',
    'data-personalization': 'Data-Driven Personalization – Tailored messaging based on user data',
    'real-time': 'Real-Time & Reactive Marketing – Capitalizing on trending topics',
    'event-based': 'Event-Based – Tied to concerts, sports, cultural events, etc.',
    'ooh-ambient': 'OOH & Ambient – Billboards, murals, and unexpected placements',
    'ai-generated': 'AI-Generated – Campaign created or enhanced by AI tools',
    'co-creation': 'Co-Creation & Collabs – Brand partnerships with artists, designers, or other brands',
    'stunt-marketing': 'Stunt Marketing – One-time, bold activations to grab attention',
    'ar-vr': 'AR/VR-Driven – Interactive digital experiences using augmented or virtual reality',
    'performance': 'Performance-Driven – Focused on measurable conversions & ROI',
    'loyalty-community': 'Loyalty & Community-Building – Built around exclusivity and brand affinity'
  };

  if (input.campaignStyle && styleDescriptions[input.campaignStyle]) {
    campaignStyleDescription = styleDescriptions[input.campaignStyle];
  }

  const defaultStrategistPersona = `
### Strategist Persona: Unfiltered Creative Director

As an award-winning creative director, your job is not to play it safe.
- Avoid cliché tech gimmicks like "AI influencers" or "AR filters" unless used subversively.
- Start from real human behavior and surprising insights.
- Challenge the brief if it's boring — bend it to make something unforgettable.
- Channel emotion, tension, chaos, humor, rebellion — anything but mediocrity.
- If the idea could have been done in 2020, it’s dead on arrival.
`;

  const personaInstructions = input.persona ? getPersonaInstructions(input.persona) : defaultStrategistPersona;

  let creativeLensInstructions = '';
  if (input.creativeLens) {
    const lens = getCreativeLensById(input.creativeLens);
    if (lens) {
      creativeLensInstructions = `
### **Creative Lens: ${lens.name}**
**Choose this creative lens and apply it to this brief before writing the idea.**

${lens.description} - ${lens.promptGuidance}

When creating this campaign, ensure that you incorporate this creative perspective throughout your thinking.
`;
    }
  }

  const creativeDevicesBlock = formatCreativeDevicesForPrompt(creativeDevices);

  const provocationBlock = `
### Creative Provocation
Before you write the campaign:
- Ask yourself: what would make people argue in the comments?
- How could this idea start a movement or a meme?
- What would Gen Z screenshot and share?
- What’s the twist that makes this campaign unforgettable?

Use this provocation to pressure-test your idea.
`;

  return `### Generate a groundbreaking marketing campaign with the following key elements:

${personaInstructions}

${creativeLensInstructions}

#### **Brand & Strategic Positioning**
- **Brand Name:** ${input.brand}
- **Industry:** ${input.industry}
- **Target Audience:** ${input.targetAudience.join(', ')}
- **Brand Personality:** ${input.brandPersonality || 'Flexible – Adapt to campaign needs'}
- **Competitive Differentiator:** ${input.differentiator || 'N/A'}
- **Current Market Trends / Cultural Insights to Consider:** ${input.culturalInsights || 'N/A'}
- **Emotional Appeal to Tap Into:** ${input.emotionalAppeal.join(', ')}

${insightsBlock}

${culturalTrendsBlock}

${creativeDevicesBlock}

${provocationBlock}

#### **Campaign Details**
- **Primary Objective:** ${input.objectives.join(', ')}
- **Campaign Style:** ${campaignStyleDescription}
- **Additional Constraints:** ${input.additionalConstraints || 'None'}

#### **Strategic Reference Campaign Injection**

Purpose: Match award-winning examples to your request.

${referencePrompt}

Draw strategic parallels, learn from their emotional appeals, and innovate beyond their tactics.

#### **Award-Winning Pattern Library**

${awardPatterns}

If relevant, use one or more of these patterns when shaping the campaign strategy or execution.

---

#### **Campaign Output Requirements:**
Please generate a campaign concept that includes:
1. **A campaign name that is bold, memorable, and culturally relevant**  
2. **A key message that is both simple and emotionally powerful**  
3. **Three creative strategies that push boundaries and bring fresh energy**  
4. **Five executional elements that maximize reach, engagement, and participation**  
5. **A cultural hook or viral trigger** (e.g., meme, challenge, unexpected collab, internet trend)  
6. **A unique brand-consumer interaction mechanic** (e.g., gamification, user participation, real-world touchpoint)  
7. **Four expected outcomes or success metrics**  
8. **A viral element** (e.g., a specific viral trigger or campaign element that will drive engagement)  
9. **A call to action** (e.g., a clear call to action for the audience to take)

---

### **Response Format:**  
Provide your response in **JSON format** with the following structure:

\`\`\`json
{
  "campaignName": "Innovative Campaign Name",
  "keyMessage": "Short, impactful key message",
  "creativeStrategy": ["Creative strategy 1", "Creative strategy 2", "Creative strategy 3"],
  "executionPlan": ["Execution item 1", "Execution item 2", "Execution item 3", "Execution item 4", "Execution item 5"],
  "viralHook": "How the campaign becomes culturally relevant and shareable",
  "consumerInteraction": "How the audience actively participates",
  "expectedOutcomes": ["Outcome 1", "Outcome 2", "Outcome 3", "Outcome 4"],
  "viralElement": "Viral element description",
  "callToAction": "Call to action description",
  "creativeInsights": ["Creative insight used 1", "Creative insight used 2", "Creative insight used 3"]
}
\`\`\`

---

### **Guidelines:**
- **Make it groundbreaking:** Think beyond traditional ads—consider experiential, tech-driven, or culture-hacking approaches.  
- **Make it insightful:** Tie the campaign to a real-world trend, behavior, or cultural moment.  
- **Make it entertaining:** Infuse humor, surprise, or an emotional twist to make the campaign unforgettable.  
- **Leverage the creative insights:** Use at least one of the provided audience insights to create a more relevant and impactful campaign.

---

**Objective:** Generate a campaign that feels like an award-winning, culture-defining moment rather than just another ad. 🚀  
`;
};
