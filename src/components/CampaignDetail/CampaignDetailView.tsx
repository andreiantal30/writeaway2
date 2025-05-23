
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SavedCampaign } from '@/lib/campaignStorage';
import { StorytellingOutput } from '@/lib/campaign/types';
import StorytellingNarrative from '@/components/StorytellingNarrative';
import BraveryMatrix from '@/components/CampaignResult/BraveryMatrix';
import { 
  Target, 
  MessageSquare, 
  Sparkles, 
  ListChecks, 
  Share2, 
  Lightbulb,
  Newspaper,
  Flame,
  FileText
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CampaignDetailViewProps {
  campaign: SavedCampaign;
}

const CampaignDetailView: React.FC<CampaignDetailViewProps> = ({ campaign }) => {
  const [tab, setTab] = useState("overview");
  
  const getStorytelling = (): StorytellingOutput | undefined => {
    if (!campaign.campaign.storytelling) return undefined;
    
    return {
      narrative: campaign.campaign.storytelling.fullNarrative || campaign.campaign.storytelling.narrative || '',
      storyNarrative: campaign.campaign.storytelling.fullNarrative || '',
      protagonistDescription: campaign.campaign.storytelling.protagonist || '',
      conflictDescription: campaign.campaign.storytelling.conflict || '',
      resolutionDescription: campaign.campaign.storytelling.resolution || '',
      brandValueConnection: campaign.campaign.storytelling.brandValueConnection || '',
      hook: campaign.campaign.storytelling.hook || '',
      protagonist: campaign.campaign.storytelling.protagonist || '',
      conflict: campaign.campaign.storytelling.conflict || '',
      journey: campaign.campaign.storytelling.journey || '',
      resolution: campaign.campaign.storytelling.resolution || '',
      fullNarrative: campaign.campaign.storytelling.fullNarrative || ''
    };
  };
  
  const storytelling = getStorytelling();
  
  const safeCampaign = {
    ...campaign.campaign,
    strategy: campaign.campaign.strategy || "No strategy specified",
    creativeStrategy: Array.isArray(campaign.campaign.creativeStrategy) ? campaign.campaign.creativeStrategy : [],
    executionPlan: Array.isArray(campaign.campaign.executionPlan) ? campaign.campaign.executionPlan : [],
    prHeadline: campaign.campaign.prHeadline || "No PR headline specified",
    viralElement: campaign.campaign.viralElement || campaign.campaign.viralHook || "No viral element specified",
    consumerInteraction: campaign.campaign.consumerInteraction || "No consumer interaction specified",
    creativeInsights: campaign.campaign.creativeInsights || {
      surfaceInsight: "No surface insight available",
      emotionalUndercurrent: "No emotional undercurrent available",
      creativeUnlock: "No creative unlock available"
    },
    narrativeAnchor: campaign.campaign.narrativeAnchor || undefined,
    expectedOutcomes: Array.isArray(campaign.campaign.expectedOutcomes) ? campaign.campaign.expectedOutcomes : []
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" value={tab} onValueChange={setTab}>
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="execution">Execution</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Target className="h-4 w-4 mr-2 text-primary" />
                  Campaign Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{safeCampaign.strategy}</p>
                
                {safeCampaign.creativeStrategy.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Creative Strategy</h3>
                    <div className="flex flex-wrap gap-2">
                      {safeCampaign.creativeStrategy.map((item, index) => (
                        <Badge key={index} variant="outline">{item}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                  Key Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{safeCampaign.keyMessage || "No key message specified"}</p>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Call to Action</h3>
                  <p className="text-sm">{safeCampaign.callToAction || "No call to action specified"}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Newspaper className="h-4 w-4 mr-2 text-primary" />
                  PR Headline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{safeCampaign.prHeadline}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Flame className="h-4 w-4 mr-2 text-primary" />
                  Viral Element
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{safeCampaign.viralElement}</p>
              </CardContent>
            </Card>
            
            {safeCampaign.braveryScores && (
              <div className="md:col-span-2">
                <BraveryMatrix scores={safeCampaign.braveryScores} />
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="execution" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <ListChecks className="h-4 w-4 mr-2 text-primary" />
                Execution Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {safeCampaign.executionPlan.length > 0 ? (
                  safeCampaign.executionPlan.map((item, index) => (
                    <li key={index} className="flex">
                      <Badge className="shrink-0 mr-2 mt-0.5" variant="outline">{index + 1}</Badge>
                      <p className="text-sm">{item}</p>
                    </li>
                  ))
                ) : (
                  <li>No execution plan specified</li>
                )}
              </ul>
              
              {safeCampaign.executionFilterRationale && (
                <div className="mt-6 pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Execution Rationale</h3>
                  <p className="text-sm text-muted-foreground">{safeCampaign.executionFilterRationale}</p>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Consumer Interaction</h3>
                <p className="text-sm">{safeCampaign.consumerInteraction}</p>
              </div>
            </CardContent>
          </Card>
          
          {storytelling && (
            <div className="mt-6">
              <StorytellingNarrative storytelling={storytelling} />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="insights" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Lightbulb className="h-4 w-4 mr-2 text-primary" />
                Creative Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Surface Insight</h3>
                <p className="text-sm text-muted-foreground">{safeCampaign.creativeInsights.surfaceInsight}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Emotional Undercurrent</h3>
                <p className="text-sm text-muted-foreground">{safeCampaign.creativeInsights.emotionalUndercurrent}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Creative Unlock</h3>
                <p className="text-sm text-muted-foreground">{safeCampaign.creativeInsights.creativeUnlock}</p>
              </div>
              
              {safeCampaign.narrativeAnchor && (
                <div className="mt-6 pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Narrative Anchors</h3>
                  <ul className="space-y-2">
                    {safeCampaign.narrativeAnchor.anchors.map((anchor, index) => (
                      <li key={index} className="flex">
                        <Badge className="shrink-0 mr-2 mt-0.5" variant="outline">{index + 1}</Badge>
                        <p className="text-sm">{anchor}</p>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">{safeCampaign.narrativeAnchor.rationale}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="evaluation" className="mt-6">
          {safeCampaign.evaluation ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-primary" />
                  Campaign Evaluation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <span className="text-green-500 mr-1.5">+</span> Strengths
                    </h3>
                    <ul className="space-y-1">
                      {safeCampaign.evaluation.strengths.map((strength, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="text-green-500 mr-1.5">•</span> {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <span className="text-amber-500 mr-1.5">→</span> Opportunities
                    </h3>
                    <ul className="space-y-1">
                      {safeCampaign.evaluation.opportunities.map((opportunity, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="text-amber-500 mr-1.5">•</span> {opportunity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <span className="text-red-500 mr-1.5">!</span> Risks
                    </h3>
                    <ul className="space-y-1">
                      {safeCampaign.evaluation.risks.map((risk, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="text-red-500 mr-1.5">•</span> {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t flex items-center justify-between">
                    <span className="font-medium">Overall Score:</span>
                    <Badge variant={safeCampaign.evaluation.overallScore >= 8 ? "default" : safeCampaign.evaluation.overallScore >= 6 ? "secondary" : "outline"}>
                      {safeCampaign.evaluation.overallScore}/10
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No evaluation data available for this campaign.
            </div>
          )}
          
          {safeCampaign.expectedOutcomes.length > 0 && (
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Target className="h-4 w-4 mr-2 text-primary" />
                    Expected Outcomes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {safeCampaign.expectedOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-sm">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignDetailView;
