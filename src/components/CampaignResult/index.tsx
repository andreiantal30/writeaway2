
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GeneratedCampaign, CampaignEvaluation } from '@/lib/campaign/types';
import FeedbackSystem, { CampaignFeedbackData } from '../FeedbackSystem';
import CampaignLeftColumn from './CampaignLeftColumn';
import CampaignRightColumn from './CampaignRightColumn';
import CampaignActions from './CampaignActions';
import CreativeDirectorFeedback from './CreativeDirectorFeedback';

export interface CampaignFeedback {
  overallRating: number;
  elementRatings: {
    campaignName: number;
    keyMessage: number;
    creativeStrategy: number;
    executionPlan: number;
  };
  comments: string;
  timestamp: string;
}

export interface CampaignResultProps {
  campaign: GeneratedCampaign;
  onGenerateAnother?: () => void;
  showFeedbackForm?: boolean;
  onRefine?: (feedback: CampaignFeedback) => Promise<void>;
}

const CampaignResult: React.FC<CampaignResultProps> = ({ 
  campaign, 
  onGenerateAnother, 
  showFeedbackForm = false, 
  onRefine 
}: CampaignResultProps) => {
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  const [elementRatings, setElementRatings] = useState<CampaignFeedback["elementRatings"]>({
    campaignName: 0,
    keyMessage: 0,
    creativeStrategy: 0,
    executionPlan: 0,
  });
  
  const handleElementRating = (element: keyof CampaignFeedback["elementRatings"], value: number) => {
    setElementRatings(prev => ({
      ...prev,
      [element]: value
    }));
  };
  
  const handleSubmitFeedback = async (feedback: CampaignFeedbackData) => {
    if (!onRefine) return;
    
    setIsSubmittingFeedback(true);
    
    try {
      // Convert the FeedbackSystem's data format to our component's format
      const campaignFeedback: CampaignFeedback = {
        overallRating: feedback.overallRating,
        comments: feedback.comments,
        elementRatings: feedback.elementRatings,
        timestamp: feedback.timestamp
      };
      
      await onRefine(campaignFeedback);
      setFeedbackSubmitted(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };
  
  // Ensure campaign has all required fields or provide defaults
  const safeCampaign: GeneratedCampaign = {
    ...campaign,
    campaignName: campaign.campaignName || "Untitled Campaign",
    keyMessage: campaign.keyMessage || "No key message available",
    brand: campaign.brand || "Brand",
    strategy: campaign.strategy || "No strategy available",
    executionPlan: Array.isArray(campaign.executionPlan) ? campaign.executionPlan : [],
    viralElement: campaign.viralElement || campaign.viralHook || "No viral element specified",
    prHeadline: campaign.prHeadline || "No PR headline available",
    consumerInteraction: campaign.consumerInteraction || "No consumer interaction specified",
    callToAction: campaign.callToAction || "No call to action specified",
    creativeInsights: campaign.creativeInsights || {
      surfaceInsight: "No surface insight available",
      emotionalUndercurrent: "No emotional undercurrent available",
      creativeUnlock: "No creative unlock available"
    },
    emotionalAppeal: Array.isArray(campaign.emotionalAppeal) ? campaign.emotionalAppeal : [],
    creativeStrategy: Array.isArray(campaign.creativeStrategy) ? campaign.creativeStrategy : []
  };
  
  return (
    <div className="space-y-6 mb-8">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-b">
          <CardTitle className="text-2xl md:text-3xl">{safeCampaign.campaignName}</CardTitle>
          <CardDescription className="text-lg md:text-xl font-medium text-foreground/90">
            {safeCampaign.keyMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {/* Two-column Cannes Lions layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <CampaignLeftColumn 
              campaign={safeCampaign} 
              showFeedbackForm={showFeedbackForm}
              feedbackSubmitted={feedbackSubmitted}
              elementRatings={elementRatings}
              onRateElement={handleElementRating}
            />
            
            <CampaignRightColumn 
              campaign={safeCampaign} 
              showFeedbackForm={showFeedbackForm}
              feedbackSubmitted={feedbackSubmitted}
              elementRatings={elementRatings}
              onRateElement={handleElementRating}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Creative Director Feedback Section */}
      {campaign.evaluation && (
        <CreativeDirectorFeedback feedback={campaign.evaluation as CampaignEvaluation} />
      )}
      
      {showFeedbackForm && !feedbackSubmitted && onRefine && (
        <div className="mt-6">
          <FeedbackSystem 
            onSubmitFeedback={handleSubmitFeedback}
            isSubmitting={isSubmittingFeedback}
          />
        </div>
      )}
      
      <CampaignActions 
        onGenerateAnother={onGenerateAnother}
        onRefine={onRefine}
        feedbackSubmitted={feedbackSubmitted}
        elementRatings={elementRatings}
        isSubmittingFeedback={isSubmittingFeedback}
      />
    </div>
  );
};

export default CampaignResult;
