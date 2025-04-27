
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PiiMatch, PiiResult, generateHighlightedText } from '@/utils/piiDetector';
import { Badge } from '@/components/ui/badge';

interface PiiHighlighterProps {
  text: string;
  piiResult: PiiResult;
}

const PiiHighlighter: React.FC<PiiHighlighterProps> = ({ text, piiResult }) => {
  const { detectedPii, piiCount, totalPiiCount } = piiResult;
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center justify-between">
            <CardTitle>PII Detection Results</CardTitle>
            <Badge variant="outline" className="ml-2">
              {totalPiiCount} PIIs Found
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(piiCount).map(([category, count]) => 
              count > 0 ? (
                <div key={category} className={`pii-tag pii-${category}`}>
                  {category}: {count}
                </div>
              ) : null
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-md border whitespace-pre-wrap text-left">
          {generateHighlightedText(text, detectedPii)}
        </div>
      </CardContent>
    </Card>
  );
};

export default PiiHighlighter;
