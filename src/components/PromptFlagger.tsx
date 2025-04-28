import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FlaggingResult, Flag } from '@/utils/contentFlagger';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, AlertCircle, Badge as BadgeIcon } from 'lucide-react';

interface PromptFlaggerProps {
  flaggingResult: FlaggingResult;
}

const PromptFlagger: React.FC<PromptFlaggerProps> = ({ flaggingResult }) => {
  const { flags, hasFlaggedContent } = flaggingResult;
  
  const displayFlags = hasFlaggedContent 
    ? flags.filter(flag => flag.category !== 'Safe Content') 
    : flags;
  
  const getFlagColor = (category: string) => {
    if (category === 'Dangerous Content') return 'bg-red-500 text-white';
    if (category === 'Unethical Instructions') return 'bg-yellow-600 text-white';
    if (category === 'Adversarial Prompting') return 'bg-purple-600 text-white';
    if (category === 'Discrimination & Hate') return 'bg-orange-600 text-white';
    if (category === 'NSFW Content') return 'bg-pink-600 text-white';
    if (category.includes('Risk')) return 'bg-amber-500 text-white';
    if (category === 'Safe Content') return 'bg-green-600 text-white';
    if (category === 'Prompt Engineering') return 'bg-blue-500 text-white';
    if (category === 'Data Scraping') return 'bg-cyan-600 text-white';
    if (category === 'Confidential') return 'bg-slate-700 text-white';
    if (category.includes('Indian')) return 'bg-indigo-600 text-white';
    return 'bg-gray-600 text-white';
  };
  
  const getCategoryIcon = (category: string) => {
    if (category === 'Dangerous Content') return <ShieldAlert className="h-4 w-4" />;
    if (category === 'Unethical Instructions') return <AlertTriangle className="h-4 w-4" />;
    if (category === 'Adversarial Prompting') return <AlertCircle className="h-4 w-4" />;
    if (category === 'Safe Content') return <ShieldCheck className="h-4 w-4" />;
    if (category.includes('Indian')) return <BadgeIcon className="h-4 w-4" />;
    return <Shield className="h-4 w-4" />;
  };
  
  const getRiskLevel = () => {
    const dangerousFlags = flags.filter(f => 
      ['Dangerous Content', 'Unethical Instructions', 'Adversarial Prompting', 'Discrimination & Hate', 'NSFW Content']
      .includes(f.category));
    
    const highestConfidence = dangerousFlags.length > 0 
      ? Math.max(...dangerousFlags.map(f => f.confidence)) 
      : 0;
      
    if (dangerousFlags.length === 0) return 'Safe';
    if (highestConfidence > 80) return 'Critical';
    if (highestConfidence > 60) return 'High';
    if (highestConfidence > 40) return 'Medium';
    return 'Low';
  };
  
  const riskLevel = getRiskLevel();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Prompt Safety Analysis</CardTitle>
          {hasFlaggedContent ? (
            <Badge variant="destructive" className="ml-2 flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5" />
              {riskLevel} Risk
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200 ml-2 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Safe Content
            </Badge>
          )}
        </div>
        <CardDescription>
          Detects potentially problematic content for LLM processing
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {hasFlaggedContent ? (
          <div className="space-y-3">
            {displayFlags.map((flag, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md border">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${getFlagColor(flag.category)}`}>
                    {getCategoryIcon(flag.category)}
                    {flag.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {flag.confidence}% confidence
                  </span>
                </div>
                <p className="text-sm text-gray-700">{flag.description}</p>
                {(flag.category === 'Dangerous Content' || flag.category === 'Unethical Instructions' || 
                  flag.category === 'Adversarial Prompting') && (
                  <div className="mt-2 text-xs bg-red-50 border border-red-100 rounded p-2 text-red-700">
                    Warning: This type of content may lead to unsafe LLM responses
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Shield className="h-12 w-12 text-green-500 mb-2" />
            <h3 className="text-lg font-medium text-gray-900">Safe Prompt Detected</h3>
            <p className="text-sm text-gray-500 max-w-md mt-1">
              No dangerous, unethical, or adversarial content detected in this prompt.
            </p>
          </div>
        )}
        
        {hasFlaggedContent && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md border">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
              <Shield className="h-4 w-4 text-gray-500" />
              Risk Assessment
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-2.5 flex-grow bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      riskLevel === 'Critical' ? 'bg-red-600' :
                      riskLevel === 'High' ? 'bg-orange-500' :
                      riskLevel === 'Medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${riskLevel === 'Safe' ? 5 : riskLevel === 'Low' ? 25 : riskLevel === 'Medium' ? 50 : riskLevel === 'High' ? 75 : 100}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  riskLevel === 'Critical' ? 'text-red-600' :
                  riskLevel === 'High' ? 'text-orange-500' :
                  riskLevel === 'Medium' ? 'text-yellow-500' :
                  'text-green-500'
                }`}>
                  {riskLevel}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromptFlagger;
