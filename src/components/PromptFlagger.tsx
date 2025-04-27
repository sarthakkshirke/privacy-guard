
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FlaggingResult, Flag } from '@/utils/contentFlagger';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldAlert, ShieldCheck, Flag as FlagIcon } from 'lucide-react';

interface PromptFlaggerProps {
  flaggingResult: FlaggingResult;
}

const PromptFlagger: React.FC<PromptFlaggerProps> = ({ flaggingResult }) => {
  const { flags, hasFlaggedContent } = flaggingResult;
  
  // Helper function to get badge variant based on flag category
  const getFlagColor = (category: string) => {
    if (category.includes('Unethical')) return 'bg-flag-ethical text-gray-800';
    if (category.includes('Dangerous')) return 'bg-flag-dangerous text-gray-800';
    if (category.includes('Adversarial')) return 'bg-flag-adversarial text-white';
    if (category.includes('Political')) return 'bg-flag-political text-gray-800';
    if (category.includes('Confidential')) return 'bg-flag-confidential text-white';
    return 'bg-gray-200 text-gray-800';
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Content Flags</CardTitle>
          {hasFlaggedContent ? (
            <Badge variant="destructive" className="ml-2 flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5" />
              Content Flagged
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200 ml-2 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              No Issues Found
            </Badge>
          )}
        </div>
        <CardDescription>
          Identifies potentially problematic content categories
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {hasFlaggedContent ? (
          <div className="space-y-3">
            {flags.map((flag, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md border">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getFlagColor(flag.category)}`}>
                    {flag.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {flag.confidence}% confidence
                  </span>
                </div>
                <p className="text-sm text-gray-700">{flag.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Shield className="h-12 w-12 text-green-500 mb-2" />
            <h3 className="text-lg font-medium text-gray-900">No Content Flags</h3>
            <p className="text-sm text-gray-500 max-w-md mt-1">
              The content appears to be free from potentially problematic language or topics.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromptFlagger;
