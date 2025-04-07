
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CampaignEvaluation } from '@/lib/campaign/types';
import { Award, Lightbulb, Zap, Rocket } from 'lucide-react';

interface CreativeDirectorFeedbackProps {
  feedback: CampaignEvaluation;
}

const CreativeDirectorFeedback: React.FC<CreativeDirectorFeedbackProps> = ({ feedback }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500 dark:text-green-400';
    if (score >= 6) return 'text-amber-500 dark:text-amber-400';
    return 'text-red-500 dark:text-red-400';
  };

  return (
    <Card className="border shadow-md">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-900/20 border-b">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          <span>Creative Director's Evaluation</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-background/80 dark:bg-gray-800/50 rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <h3 className="font-medium">Insight Sharpness</h3>
            </div>
            <p className={`text-2xl font-bold ${getScoreColor(feedback.insightSharpness.score)}`}>
              {feedback.insightSharpness.score}/10
            </p>
            <p className="text-sm text-muted-foreground mt-1">{feedback.insightSharpness.comment}</p>
          </div>

          <div className="p-4 bg-background/80 dark:bg-gray-800/50 rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-amber-500" />
              <h3 className="font-medium">Idea Originality</h3>
            </div>
            <p className={`text-2xl font-bold ${getScoreColor(feedback.ideaOriginality.score)}`}>
              {feedback.ideaOriginality.score}/10
            </p>
            <p className="text-sm text-muted-foreground mt-1">{feedback.ideaOriginality.comment}</p>
          </div>

          <div className="p-4 bg-background/80 dark:bg-gray-800/50 rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              <Rocket className="h-4 w-4 text-amber-500" />
              <h3 className="font-medium">Execution Potential</h3>
            </div>
            <p className={`text-2xl font-bold ${getScoreColor(feedback.executionPotential.score)}`}>
              {feedback.executionPotential.score}/10
            </p>
            <p className="text-sm text-muted-foreground mt-1">{feedback.executionPotential.comment}</p>
          </div>

          <div className="p-4 bg-background/80 dark:bg-gray-800/50 rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-amber-500" />
              <h3 className="font-medium">Award Potential</h3>
            </div>
            <p className={`text-2xl font-bold ${getScoreColor(feedback.awardPotential.score)}`}>
              {feedback.awardPotential.score}/10
            </p>
            <p className="text-sm text-muted-foreground mt-1">{feedback.awardPotential.comment}</p>
          </div>
        </div>

        <div className="mt-4 bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
          <h3 className="font-medium mb-2 text-amber-800 dark:text-amber-300">Final Verdict</h3>
          <p className="text-amber-900 dark:text-amber-200 italic">{feedback.finalVerdict}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreativeDirectorFeedback;
