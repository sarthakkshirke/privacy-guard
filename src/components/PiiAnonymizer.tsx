
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { anonymizePii, generateAnonymizedHighlightedText } from '@/utils/anonymizer';
import { PiiCategory, PiiMatch } from '@/utils/piiDetector';
import { Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import PiiProcessingOptions, { ProcessingMode } from './PiiProcessingOptions';

interface PiiAnonymizerProps {
  text: string;
  detectedPii: PiiMatch[];
}

const PiiAnonymizer: React.FC<PiiAnonymizerProps> = ({ text, detectedPii }) => {
  const [copied, setCopied] = useState(false);
  const [processingMode, setProcessingMode] = useState<ProcessingMode>('anonymize');
  const [selectedCategories, setSelectedCategories] = useState<PiiCategory[]>(Object.values(PiiCategory));
  
  const processedText = anonymizePii(text, detectedPii, selectedCategories, processingMode);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(processedText);
    setCopied(true);
    toast.success('Processed text copied to clipboard');
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleModeChange = (mode: ProcessingMode) => {
    setProcessingMode(mode);
  };

  const handleCategoriesChange = (categories: PiiCategory[]) => {
    setSelectedCategories(categories);
  };

  return (
    <div className="space-y-6">
      <PiiProcessingOptions
        selectedMode={processingMode}
        selectedCategories={selectedCategories}
        onModeChange={handleModeChange}
        onCategoriesChange={handleCategoriesChange}
      />
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {processingMode === 'anonymize' && 'Anonymized Version'}
            {processingMode === 'redact' && 'Redacted Version'}
            {processingMode === 'encrypt' && 'Encrypted Version'}
          </CardTitle>
          <CardDescription>
            {processingMode === 'anonymize' && 'Using synthetic data to preserve context while protecting information'}
            {processingMode === 'redact' && 'Completely hiding sensitive information with redaction markers'}
            {processingMode === 'encrypt' && 'Securely transforming sensitive information with encryption'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-md border whitespace-pre-wrap text-left">
            {generateAnonymizedHighlightedText(text, detectedPii, selectedCategories, processingMode)}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button onClick={handleCopy} variant="outline" className="gap-2">
            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy Processed Text'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PiiAnonymizer;
