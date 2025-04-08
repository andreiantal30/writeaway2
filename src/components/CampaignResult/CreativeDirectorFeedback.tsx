
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CampaignEvaluation } from '@/lib/campaign/types';
import { Award, ThumbsUp, Star, CheckCircle2, Lightbulb } from 'lucide-react';

interface CreativeDirectorFeedbackProps {
  feedback: CampaignEvaluation;
}

const CreativeDirectorFeedback: React.FC<CreativeDirectorFeedbackProps> = ({ feedback }) => {
  if (!feedback) {
    return null;
  }

  // Helper function to get a color class based on score
  const getScoreColorClass = (score: number): string => {
    if (score >= 8) return 'text-green-500 dark:text-green-400';
    if (score >= 6) return 'text-amber-500 dark:text-amber-400';
    return 'text-red-500 dark:text-red-400';
  };

  // Helper function to get score or fallback
  const getScore = (score?: number): number => {
    return typeof score === 'number' ? score : 0;
  };

  // Safely access feedback criteria
  const insightSharpness = feedback?.insightSharpness || { score: 0, comment: "Not rated" };
  const ideaOriginality = feedback?.ideaOriginality || { score: 0, comment: "Not rated" };
  const executionPotential = feedback?.executionPotential || { score: 0, comment: "Not rated" };
  const awardPotential = feedback?.awardPotential || { score: 0, comment: "Not rated" };
  
  return (
    <Card className="border-0 bg-muted/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-lg">Creative Director Feedback</CardTitle>
        </div>
        <CardDescription>
          Expert assessment of the campaign's creative potential
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Scores */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">ASSESSMENT SCORES</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Insight Sharpness</span>
                  <span className={`text-lg font-bold ${getScoreColorClass(getScore(insightSharpness?.score))}`}>
                    {getScore(insightSharpness?.score)}/10
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{insightSharpness?.comment || "No comment provided"}</p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Idea Originality</span>
                  <span className={`text-lg font-bold ${getScoreColorClass(getScore(ideaOriginality?.score))}`}>
                    {getScore(ideaOriginality?.score)}/10
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{ideaOriginality?.comment || "No comment provided"}</p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Execution Potential</span>
                  <span className={`text-lg font-bold ${getScoreColorClass(getScore(executionPotential?.score))}`}>
                    {getScore(executionPotential?.score)}/10
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{executionPotential?.comment || "No comment provided"}</p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Award Potential</span>
                  <span className={`text-lg font-bold ${getScoreColorClass(getScore(awardPotential?.score))}`}>
                    {getScore(awardPotential?.score)}/10
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{awardPotential?.comment || "No comment provided"}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Final Verdict */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">FINAL VERDICT</h3>
            <div className="bg-muted/50 p-4 rounded-md border border-muted">
              <p className="text-md font-medium italic">
                {feedback.finalVerdict || "No final verdict provided"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreativeDirectorFeedback;
