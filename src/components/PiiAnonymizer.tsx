
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { anonymizePii, generateAnonymizedHighlightedText } from '@/utils/anonymizer';
import { PiiMatch } from '@/utils/piiDetector';
import { Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PiiAnonymizerProps {
  text: string;
  detectedPii: PiiMatch[];
}

const PiiAnonymizer: React.FC<PiiAnonymizerProps> = ({ text, detectedPii }) => {
  const [copied, setCopied] = useState(false);
  
  const anonymizedText = anonymizePii(text, detectedPii);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(anonymizedText);
    setCopied(true);
    toast.success('Anonymized text copied to clipboard');
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Anonymized Version</CardTitle>
        <CardDescription>
          Use this version to preserve context while protecting sensitive information
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-md border whitespace-pre-wrap text-left">
          {generateAnonymizedHighlightedText(text, detectedPii)}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button onClick={handleCopy} variant="outline" className="gap-2">
          {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy Anonymized Text'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PiiAnonymizer;
