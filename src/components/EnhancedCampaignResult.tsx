
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GeneratedCampaign, CampaignEvaluation } from "@/lib/campaign/types";
import { Badge } from "@/components/ui/badge";
import { Award, Lightbulb } from "lucide-react";
import { CampaignFeedback } from "@/components/CampaignResult";
import { Button } from "@/components/ui/button";
import CreativeDirectorFeedback from "./CampaignResult/CreativeDirectorFeedback";

export interface EnhancedCampaignResultProps {
  campaign: GeneratedCampaign;
  onGenerateAnother?: () => void;
  showFeedbackForm?: boolean;
  onRefine?: (feedback: CampaignFeedback) => Promise<void>;
}

const EnhancedCampaignResult: React.FC<EnhancedCampaignResultProps> = ({ 
  campaign,
  onGenerateAnother,
  showFeedbackForm = false,
  onRefine 
}) => {
  // Create safe campaign object with defaults
  const safeCampaign = {
    campaignName: campaign.campaignName || "Untitled Campaign",
    keyMessage: campaign.keyMessage || "No insight available",
    creativeInsights: campaign.creativeInsights || {
      surfaceInsight: "No surface insight available",
      emotionalUndercurrent: "No emotional undercurrent available",
      creativeUnlock: "No creative unlock available"
    },
    emotionalAppeal: Array.isArray(campaign.emotionalAppeal) ? campaign.emotionalAppeal : [],
    callToAction: campaign.callToAction || campaign.consumerInteraction || "No call to action available",
    creativeStrategy: Array.isArray(campaign.creativeStrategy) ? campaign.creativeStrategy : [],
    executionPlan: Array.isArray(campaign.executionPlan) ? campaign.executionPlan : [],
    expectedOutcomes: Array.isArray(campaign.expectedOutcomes) ? campaign.expectedOutcomes : [],
    referenceCampaigns: Array.isArray(campaign.referenceCampaigns) ? campaign.referenceCampaigns : []
  };

  return (
    <Card className="border shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border-b">
        <CardTitle className="text-xl font-bold text-center">{safeCampaign.campaignName}</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Two-column Cannes Lions style layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column (40% width) */}
          <div className="md:col-span-5 space-y-6 border-r-0 md:border-r border-dashed border-gray-200 dark:border-gray-700 pr-0 md:pr-6">
            {/* The Insight / Key Message */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">The Insight</h3>
              <p className="text-md">{safeCampaign.keyMessage}</p>
            </div>
            
            <Separator className="my-4" />
            
            {/* The Idea / Campaign Name */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">The Idea</h3>
              <p className="text-md font-medium">{safeCampaign.campaignName}</p>
            </div>
            
            {/* Display Creative Insights if available */}
            {campaign.creativeInsights && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    <h3 className="text-lg font-semibold text-primary">Creative Insights</h3>
                  </div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li className="text-md italic">{safeCampaign.creativeInsights.surfaceInsight}</li>
                    <li className="text-md italic">{safeCampaign.creativeInsights.emotionalUndercurrent}</li>
                    <li className="text-md italic">{safeCampaign.creativeInsights.creativeUnlock}</li>
                  </ul>
                </div>
              </>
            )}
            
            {/* Emotional Appeal / Strategic Hooks */}
            {safeCampaign.emotionalAppeal.length > 0 && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-primary">Emotional & Strategic Hooks</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {safeCampaign.emotionalAppeal.map((appeal, index) => (
                      <li key={index} className="text-md">{appeal}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
            
            {/* Call to Action */}
            {safeCampaign.callToAction && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-primary">Call to Action</h3>
                  <p className="text-md">{safeCampaign.callToAction}</p>
                </div>
              </>
            )}
          </div>
          
          {/* Right Column (60% width) */}
          <div className="md:col-span-7 space-y-6 pl-0 md:pl-6">
            {/* The How / Creative Strategy */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">The How</h3>
              <div className="space-y-4">
                <p className="text-md">Implementation strategy to bring the idea to life:</p>
                <ul className="list-decimal pl-5 space-y-2">
                  {safeCampaign.creativeStrategy.length > 0 
                    ? safeCampaign.creativeStrategy.map((strategy, index) => (
                      <li key={index} className="text-md">{strategy}</li>
                    ))
                    : <li className="text-md">Strategy details not available</li>
                  }
                </ul>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Execution Plan */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">Execution Plan</h3>
              <ol className="list-decimal pl-5 space-y-2">
                {safeCampaign.executionPlan.length > 0 
                  ? safeCampaign.executionPlan.map((execution, index) => (
                    <li key={index} className="text-md">{execution}</li>
                  ))
                  : <li className="text-md">Execution details not available</li>
                }
              </ol>
            </div>
            
            {/* Expected Outcomes */}
            {safeCampaign.expectedOutcomes.length > 0 && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-primary">Expected Outcomes</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {safeCampaign.expectedOutcomes.map((outcome, index) => (
                      <li key={index} className="text-md">{outcome}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
            
            {/* Reference Campaigns */}
            {safeCampaign.referenceCampaigns.length > 0 && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-primary">Reference Campaigns</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {safeCampaign.referenceCampaigns.map((refCampaign, index) => (
                      <div key={index} className="bg-muted/40 p-3 rounded-lg border border-muted">
                        <h4 className="font-medium text-sm">{refCampaign.name || "Unnamed Campaign"}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="font-medium">{refCampaign.brand || "Unknown Brand"}</span>
                          {refCampaign.year && (
                            <> · {refCampaign.year}</>
                          )}
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
        </div>
        
        {/* Creative Director Feedback Section */}
        {campaign.evaluation && (
          <div className="mt-6">
            <CreativeDirectorFeedback feedback={campaign.evaluation} />
          </div>
        )}
        
        {onGenerateAnother && (
          <div className="flex justify-center mt-8">
            <Button onClick={onGenerateAnother} variant="outline">
              Generate Another Campaign
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedCampaignResult;
