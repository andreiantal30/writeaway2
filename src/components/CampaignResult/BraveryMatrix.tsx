
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { BraveryScores } from '@/lib/campaign/types';
import { Sparkles, Zap, TrendingUp, Activity } from 'lucide-react';

interface BraveryMatrixProps {
  scores: BraveryScores;
}

const BraveryMatrix: React.FC<BraveryMatrixProps> = ({ scores }) => {
  // Returns a color based on the score
  const getScoreColor = (score: number): string => {
    if (score >= 8) return 'bg-red-500';
    if (score >= 6) return 'bg-orange-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 8) return 'Bold';
    if (score >= 6) return 'Brave';
    if (score >= 4) return 'Balanced';
    return 'Safe';
  };

  return (
    <div className="mt-6 p-4 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <Sparkles className="mr-2 h-5 w-5 text-primary" />
        Execution Bravery Matrix
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" />
            <span className="text-sm">Physicality</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress 
              value={scores.physicality * 10} 
              className={`w-40 h-2 ${getScoreColor(scores.physicality)}`} 
            />
            <span className="text-sm font-medium">{scores.physicality}/10</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress 
              value={scores.risk * 10} 
              className={`w-40 h-2 ${getScoreColor(scores.risk)}`} 
            />
            <span className="text-sm font-medium">{scores.risk}/10</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-orange-500" />
            <span className="text-sm">Cultural Tension</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress 
              value={scores.culturalTension * 10} 
              className={`w-40 h-2 ${getScoreColor(scores.culturalTension)}`} 
            />
            <span className="text-sm font-medium">{scores.culturalTension}/10</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-red-500" />
            <span className="text-sm">Novelty</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress 
              value={scores.novelty * 10} 
              className={`w-40 h-2 ${getScoreColor(scores.novelty)}`} 
            />
            <span className="text-sm font-medium">{scores.novelty}/10</span>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="font-medium">Overall Bravery Score</span>
            <div className="flex items-center gap-2">
              <div className={`px-2 py-1 rounded text-white font-bold ${getScoreColor(scores.totalScore)}`}>
                {scores.totalScore}/10
              </div>
              <span className="text-sm">{getScoreLabel(scores.totalScore)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BraveryMatrix;
