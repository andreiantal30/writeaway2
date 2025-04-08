
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CampaignEvaluation } from '@/lib/campaign/types';
import { Award, Check, AlertCircle, Lightbulb } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CreativeDirectorFeedbackProps {
  feedback: CampaignEvaluation;
}

const CreativeDirectorFeedback: React.FC<CreativeDirectorFeedbackProps> = ({ feedback }) => {
  // Helper function to get the right color based on score
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-amber-500';
    if (score >= 4) return 'text-orange-500';
    return 'text-red-500';
  };
  
  // Helper function to get the progress color
  const getProgressColor = (score: number) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-amber-500';
    if (score >= 4) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  return (
    <Card className="border-none shadow-none bg-slate-50 dark:bg-slate-900/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Award className="mr-2 h-5 w-5 text-amber-500" />
          Creative Director Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Scores */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Campaign Assessment</h3>
            
            <div className="space-y-4">
              {/* Overall Score */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Overall Creative Quality</span>
                  <span className={`font-bold ${getScoreColor(feedback.overallScore)}`}>
                    {feedback.overallScore}/10
                  </span>
                </div>
                <Progress value={feedback.overallScore * 10} className={`h-2 ${getProgressColor(feedback.overallScore)}`} />
              </div>
              
              {/* Bravery Score */}
              {feedback.braveryScore !== undefined && (
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Execution Bravery</span>
                    <span className={`font-bold ${getScoreColor(feedback.braveryScore)}`}>
                      {feedback.braveryScore}/10
                    </span>
                  </div>
                  <Progress value={feedback.braveryScore * 10} className={`h-2 ${getProgressColor(feedback.braveryScore)}`} />
                </div>
              )}
            </div>
            
            {/* Strengths */}
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Strengths
              </h3>
              <ul className="pl-6 space-y-1 list-disc text-sm">
                {feedback.strengths.map((strength, i) => (
                  <li key={i}>{strength}</li>
                ))}
              </ul>
            </div>
            
            {/* Risks */}
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
                Risks
              </h3>
              <ul className="pl-6 space-y-1 list-disc text-sm">
                {feedback.risks.map((risk, i) => (
                  <li key={i}>{risk}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Right Column - Opportunities */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center">
              <Lightbulb className="mr-2 h-4 w-4 text-blue-500" />
              Opportunities for Improvement
            </h3>
            <ul className="pl-6 space-y-3 list-disc">
              {feedback.opportunities.map((opportunity, i) => (
                <li key={i} className="text-sm">{opportunity}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreativeDirectorFeedback;
