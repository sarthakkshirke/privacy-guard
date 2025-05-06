
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { anonymizePii, generateAnonymizedHighlightedText } from '@/utils/pii';
import { PiiCategory, PiiMatch } from '@/utils/piiDetector';
import { Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import PiiProcessingOptions, { ProcessingMode } from './PiiProcessingOptions';

interface PiiAnonymizerProps {
  text: string;
  detectedPii: PiiMatch[];
  initialMode?: ProcessingMode;
  initialCategories?: PiiCategory[];
}

const PiiAnonymizer: React.FC<PiiAnonymizerProps> = ({ 
  text, 
  detectedPii,
  initialMode = 'anonymize',
  initialCategories
}) => {
  const [copied, setCopied] = useState(false);
  const [processingMode, setProcessingMode] = useState<ProcessingMode>(initialMode);
  const [selectedCategories, setSelectedCategories] = useState<PiiCategory[]>(
    initialCategories || Object.keys({
      name: 'name',
      email: 'email',
      phone: 'phone',
      address: 'address',
      id: 'id',
      financial: 'financial',
      health: 'health',
      other: 'other',
      indian_id: 'indian_id',
      indian_financial: 'indian_financial'
    }) as PiiCategory[]
  );
  
  // Keep processing mode in sync with initial mode when it changes
  useEffect(() => {
    if (initialMode) {
      setProcessingMode(initialMode);
    }
  }, [initialMode]);

  // Keep selected categories in sync with initialCategories when they change
  useEffect(() => {
    if (initialCategories) {
      setSelectedCategories(initialCategories);
    }
  }, [initialCategories]);
  
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

  // Define card titles and descriptions based on mode
  const cardTitles = {
    anonymize: 'Anonymized Version',
    redact: 'Redacted Version',
    encrypt: 'Encrypted Version'
  };
  
  const cardDescriptions = {
    anonymize: 'Using synthetic data to preserve context while protecting information',
    redact: 'Completely hiding sensitive information with redaction markers',
    encrypt: 'Securely transforming sensitive information with encryption'
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
            {cardTitles[processingMode]}
          </CardTitle>
          <CardDescription>
            {cardDescriptions[processingMode]}
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
