
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { detectPii } from '@/utils/piiDetector';
import { calculateRiskScore } from '@/utils/riskScorer';
import { flagContent } from '@/utils/contentFlagger';

interface TextInputProps {
  onAnalyze: (text: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ onAnalyze }) => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call delay - in a real app this might be an actual API call
    setTimeout(() => {
      onAnalyze(text);
      setIsLoading(false);
    }, 500);
  };

  const handleSampleText = () => {
    const sampleText = `Hello, my name is John Smith and I'm sending this email from john.smith@example.com. 
    You can reach me at (555) 123-4567 or visit me at 123 Main Street, Springfield, IL 12345. 
    My social security number is 123-45-6789 and my credit card number is 4111-1111-1111-1111. 
    My patient ID is Patient ID: XYZ-123456 and this information is confidential. 
    I work for a large political organization that deals with sensitive government contracts.`;
    
    setText(sampleText);
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Enter text to analyze</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSampleText}
            >
              Load Sample
            </Button>
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text containing potential PII or sensitive information..."
            className="min-h-[200px]"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={!text.trim() || isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Content'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TextInput;
