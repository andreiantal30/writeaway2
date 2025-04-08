
import React from 'react';
import { GeneratedCampaign } from '@/lib/generateCampaign';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Info, Sparkles, FileText, Zap, Lightbulb, Target } from 'lucide-react';
import StorytellingNarrative from '@/components/StorytellingNarrative';
import BraveryMatrix from './BraveryMatrix';

interface CampaignRightColumnProps {
  campaign: GeneratedCampaign;
}

const CampaignRightColumn: React.FC<CampaignRightColumnProps> = ({ campaign }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Lightbulb className="h-4 w-4 mr-2 text-primary" />
            Creative Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Surface Insight</h4>
            <p className="text-sm text-muted-foreground">
              {campaign.creativeInsights.surfaceInsight}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Emotional Undercurrent</h4>
            <p className="text-sm text-muted-foreground">
              {campaign.creativeInsights.emotionalUndercurrent}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Creative Unlock</h4>
            <p className="text-sm text-muted-foreground">
              {campaign.creativeInsights.creativeUnlock}
            </p>
          </div>
        </CardContent>
      </Card>

      {campaign.narrativeAnchor && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Target className="h-4 w-4 mr-2 text-primary" />
              Narrative Anchors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[170px] pr-4">
              <div className="space-y-2">
                {campaign.narrativeAnchor.anchors.map((anchor, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5 shrink-0">
                      {index + 1}
                    </Badge>
                    <p className="text-sm">{anchor}</p>
                  </div>
                ))}
                <div className="pt-2 mt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    {campaign.narrativeAnchor.rationale}
                  </p>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {campaign.storytelling && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-4 w-4 mr-2 text-primary" />
              Storytelling Narrative
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StorytellingNarrative storytelling={campaign.storytelling} />
          </CardContent>
        </Card>
      )}

      {campaign.expectedOutcomes && campaign.expectedOutcomes.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Target className="h-4 w-4 mr-2 text-primary" />
              Expected Outcomes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[150px] pr-4">
              <ul className="space-y-2">
                {campaign.expectedOutcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2 font-bold">•</span>
                    <span className="text-sm">{outcome}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {campaign.braveryScores && (
        <BraveryMatrix scores={campaign.braveryScores} />
      )}

      {campaign.emotionalAppeal && campaign.emotionalAppeal.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Zap className="h-4 w-4 mr-2 text-primary" />
              Emotional Appeal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {campaign.emotionalAppeal.map((emotion, index) => (
                <Badge key={index} variant="secondary">{emotion}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {campaign.evaluation && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              Campaign Evaluation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium flex items-center">
                  <span className="text-green-500 mr-1.5">+</span> Strengths
                </h4>
                <ul className="mt-1 space-y-1">
                  {campaign.evaluation.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="text-green-500 mr-1.5">•</span> {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium flex items-center">
                  <span className="text-amber-500 mr-1.5">→</span> Opportunities
                </h4>
                <ul className="mt-1 space-y-1">
                  {campaign.evaluation.opportunities.map((opportunity, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="text-amber-500 mr-1.5">•</span> {opportunity}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium flex items-center">
                  <span className="text-red-500 mr-1.5">!</span> Risks
                </h4>
                <ul className="mt-1 space-y-1">
                  {campaign.evaluation.risks.map((risk, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="text-red-500 mr-1.5">•</span> {risk}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="text-sm font-medium">Overall Score:</span>
                <Badge variant={campaign.evaluation.overallScore >= 8 ? "default" : campaign.evaluation.overallScore >= 6 ? "secondary" : "outline"}>
                  {campaign.evaluation.overallScore}/10
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="p-3">
        <p className="text-xs text-muted-foreground text-center">
          <Info className="h-3 w-3 inline-block mr-1 opacity-70" />
          Content generated with AI assistance
        </p>
      </div>
    </div>
  );
};

export default CampaignRightColumn;
