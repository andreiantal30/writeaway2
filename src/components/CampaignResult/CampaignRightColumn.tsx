
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { GeneratedCampaign } from '@/lib/campaign/types';
import { Button } from '@/components/ui/button';
import { ThumbsDown as ThumbsDownIcon, ThumbsUp as ThumbsUpIcon } from 'lucide-react';
import { CampaignFeedback } from '../CampaignResult';

export interface CampaignRightColumnProps {
  campaign: GeneratedCampaign;
  elementRatings: CampaignFeedback["elementRatings"];
  onRateElement: (element: keyof CampaignFeedback["elementRatings"], value: number) => void;
  showFeedbackForm?: boolean;
  feedbackSubmitted?: boolean;
}

const CampaignRightColumn: React.FC<CampaignRightColumnProps> = ({ 
  campaign, 
  elementRatings, 
  onRateElement,
  showFeedbackForm = false,
  feedbackSubmitted = false
}) => {
  return (
    <div className="md:col-span-7 space-y-6 pl-0 md:pl-6">
      {/* Creative Strategy Section - The How */}
      <div className="space-y-2">
        <h3 className="font-medium text-lg text-primary flex items-center justify-between">
          The How
          {showFeedbackForm && !feedbackSubmitted && (
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onRateElement("creativeStrategy", -1)}
                className={elementRatings.creativeStrategy === -1 ? "bg-red-100 dark:bg-red-900/20" : ""}
              >
                <ThumbsDownIcon className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onRateElement("creativeStrategy", 1)}
                className={elementRatings.creativeStrategy === 1 ? "bg-green-100 dark:bg-green-900/20" : ""}
              >
                <ThumbsUpIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </h3>
        <ul className="list-disc pl-5 space-y-2">
          {Array.isArray(campaign.creativeStrategy) ? 
            campaign.creativeStrategy.map((strategy, index) => (
              <li key={index}>{strategy}</li>
            )) : 
            <li>{campaign.creativeStrategy}</li>
          }
        </ul>
      </div>
      
      <Separator />
      
      {/* Execution Plan Section */}
      <div className="space-y-2">
        <h3 className="font-medium text-lg text-primary flex items-center justify-between">
          Execution Plan
          {showFeedbackForm && !feedbackSubmitted && (
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onRateElement("executionPlan", -1)}
                className={elementRatings.executionPlan === -1 ? "bg-red-100 dark:bg-red-900/20" : ""}
              >
                <ThumbsDownIcon className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onRateElement("executionPlan", 1)}
                className={elementRatings.executionPlan === 1 ? "bg-green-100 dark:bg-green-900/20" : ""}
              >
                <ThumbsUpIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </h3>
        <ol className="list-decimal pl-5 space-y-2">
          {Array.isArray(campaign.executionPlan) ? 
            campaign.executionPlan.map((execution, index) => (
              <li key={index} className="pl-1">
                <span className="ml-1">{execution}</span>
              </li>
            )) : 
            <li>{campaign.executionPlan}</li>
          }
        </ol>
      </div>
      
      {/* Expected Outcomes Section */}
      {campaign.expectedOutcomes && campaign.expectedOutcomes.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-medium text-lg text-primary">Expected Outcomes</h3>
            <ul className="list-disc pl-5 space-y-2">
              {Array.isArray(campaign.expectedOutcomes) ? 
                campaign.expectedOutcomes.map((outcome, index) => (
                  <li key={index} className="pl-1">
                    <span className="ml-1">{outcome}</span>
                  </li>
                )) : 
                <li>{campaign.expectedOutcomes}</li>
              }
            </ul>
          </div>
        </>
      )}
      
      {/* Reference Campaigns Section */}
      {campaign.referenceCampaigns && campaign.referenceCampaigns.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <h3 className="font-medium text-lg text-primary">Reference Campaigns</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {campaign.referenceCampaigns.map((refCampaign, index) => (
                <div key={index} className="bg-muted/40 p-3 rounded-lg border border-muted">
                  <h4 className="font-medium">{refCampaign.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">{refCampaign.brand}</span>
                    {refCampaign.industry && (
                      <> · {refCampaign.industry}</>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CampaignRightColumn;
