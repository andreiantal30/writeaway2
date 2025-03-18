
import React from "react";
import { Button } from "@/components/ui/button";
import { GeneratedCampaign } from "@/lib/generateCampaign";
import TransitionElement from "./TransitionElement";
import { Campaign } from "@/lib/campaignData";
import { Check, Copy, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface CampaignResultProps {
  campaign: GeneratedCampaign;
  onGenerateAnother: () => void;
}

const CampaignResult: React.FC<CampaignResultProps> = ({ campaign, onGenerateAnother }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const campaignText = `
Campaign Name: ${campaign.campaignName}

Key Message: ${campaign.keyMessage}

Creative Strategy:
${campaign.creativeStrategy.map(strategy => `- ${strategy}`).join('\n')}

Execution Plan:
${campaign.executionPlan.map(plan => `- ${plan}`).join('\n')}

Expected Outcomes:
${campaign.expectedOutcomes.map(outcome => `- ${outcome}`).join('\n')}
    `;
    
    navigator.clipboard.writeText(campaignText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TransitionElement animation="fade" className="w-full max-w-4xl mx-auto">
      <div className="bg-white/50 backdrop-blur-lg border border-border rounded-2xl shadow-subtle p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-medium">Generated Campaign</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-sm"
              onClick={handleCopy}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-sm"
              onClick={onGenerateAnother}
            >
              <RefreshCw size={16} />
              Regenerate
            </Button>
          </div>
        </div>
        
        <div className="space-y-8">
          <TransitionElement delay={100} animation="slide-up">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">Campaign Name</h3>
              <div className="text-3xl md:text-4xl font-medium text-primary">{campaign.campaignName}</div>
            </div>
          </TransitionElement>
          
          <TransitionElement delay={200} animation="slide-up">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">Key Message</h3>
              <div className="text-xl md:text-2xl italic">"{campaign.keyMessage}"</div>
            </div>
          </TransitionElement>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TransitionElement delay={300} animation="slide-up">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">Creative Strategy</h3>
                <ul className="space-y-3">
                  {campaign.creativeStrategy.map((strategy, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                        <Check size={16} />
                      </span>
                      <span>{strategy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TransitionElement>
            
            <TransitionElement delay={400} animation="slide-up">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">Execution Plan</h3>
                <ul className="space-y-3">
                  {campaign.executionPlan.map((plan, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                        <Check size={16} />
                      </span>
                      <span>{plan}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TransitionElement>
          </div>
          
          <TransitionElement delay={500} animation="slide-up">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">Expected Outcomes</h3>
              <ul className="space-y-3">
                {campaign.expectedOutcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                      <Check size={16} />
                    </span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TransitionElement>
          
          <TransitionElement delay={600} animation="slide-up">
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                Inspired by These Award-Winning Campaigns
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {campaign.referenceCampaigns.map((ref, index) => (
                  <InspirationCard key={index} campaign={ref} index={index} />
                ))}
              </div>
            </div>
          </TransitionElement>
        </div>
      </div>
    </TransitionElement>
  );
};

interface InspirationCardProps {
  campaign: Campaign;
  index: number;
}

const InspirationCard: React.FC<InspirationCardProps> = ({ campaign, index }) => {
  return (
    <TransitionElement 
      delay={700 + index * 100} 
      animation="slide-up" 
      className="bg-white/70 backdrop-blur-sm border rounded-lg p-4 hover:shadow-subtle transition-shadow duration-300"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
            {campaign.year}
          </div>
          <div className="text-xs text-muted-foreground">{campaign.industry}</div>
        </div>
        
        <h4 className="font-medium text-lg">{campaign.name}</h4>
        <div className="text-sm text-muted-foreground">by {campaign.brand}</div>
        
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-1">Key Message:</div>
          <div className="text-sm italic">"{campaign.keyMessage}"</div>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {campaign.emotionalAppeal.slice(0, 3).map((emotion, i) => (
            <span
              key={i}
              className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                i === 0 ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
              )}
            >
              {emotion}
            </span>
          ))}
        </div>
      </div>
    </TransitionElement>
  );
};

export default CampaignResult;
