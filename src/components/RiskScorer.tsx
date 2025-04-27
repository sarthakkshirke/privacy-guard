
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, Flag, AlertCircle } from 'lucide-react';
import { RiskScore } from '@/utils/riskScorer';

interface RiskScorerProps {
  riskScore: RiskScore;
}

const RiskScorer: React.FC<RiskScorerProps> = ({ riskScore }) => {
  const { score, level, factors } = riskScore;

  // Get color based on risk level
  const getRiskColor = () => {
    switch (level) {
      case 'critical':
        return 'bg-risk-critical';
      case 'high':
        return 'bg-risk-high';
      case 'medium':
        return 'bg-risk-medium';
      case 'low':
      default:
        return 'bg-risk-low';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Risk Assessment</CardTitle>
          <div className={`risk-badge ${getRiskColor()}`}>
            {level.toUpperCase()}
          </div>
        </div>
        <CardDescription>
          Overall risk score: {score}/100
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Progress 
          value={score} 
          className={`h-3 ${getRiskColor()}`} 
        />
        
        <div className="space-y-4 mt-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> Risk Factors
          </h4>
          
          <div className="space-y-2">
            {factors.map((factor, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md border">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-sm">{factor.name}</span>
                  <span className="text-sm text-gray-500">+{factor.score} points</span>
                </div>
                <p className="text-xs text-gray-600">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskScorer;
