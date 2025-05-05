
import React, { useState } from 'react';
import { detectPii, PiiResult } from '@/utils/piiDetector';
import { calculateRiskScore, RiskScore } from '@/utils/riskScorer';
import { flagContent, FlaggingResult } from '@/utils/contentFlagger';
import ChatInterface from './Chat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RiskScorer from './RiskScorer';
import PiiHighlighter from './PiiHighlighter';
import PiiAnonymizer from './PiiAnonymizer';
import PromptFlagger from './PromptFlagger';
import { Shield, FileText } from 'lucide-react';
import { anonymizePii } from '@/utils/pii';
import { PiiCategory } from '@/utils/piiDetector';

const Dashboard: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [piiResult, setPiiResult] = useState<PiiResult | null>(null);
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [flaggingResult, setFlaggingResult] = useState<FlaggingResult | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [processingEnabled, setProcessingEnabled] = useState<boolean>(true);
  const [processingMode, setProcessingMode] = useState<'anonymize' | 'redact' | 'encrypt'>('anonymize');
  const [selectedCategories, setSelectedCategories] = useState<PiiCategory[]>([
    'name', 'email', 'phone', 'address', 'id', 'financial', 'health', 'other', 'indian_id', 'indian_financial'
  ]);
  
  const handleAnalyzeContent = (content: string, processBeforeSending: boolean = false) => {
    // Process the original text to detect PII
    const detectedPiiResult = detectPii(content);
    setPiiResult(detectedPiiResult);
    
    // Store the original text
    setText(content);
    
    // Store detected PII with any preprocessing done
    if (processBeforeSending && processingEnabled) {
      // This call processes and stores the anonymized values in the PII matches
      anonymizePii(content, detectedPiiResult.detectedPii, selectedCategories, processingMode);
    }
    
    // Calculate risk score based on original text for accurate assessment
    const calculatedRiskScore = calculateRiskScore(content, detectedPiiResult);
    setRiskScore(calculatedRiskScore);
    
    // Flag content based on original text
    const flagResult = flagContent(content);
    setFlaggingResult(flagResult);
    
    // Show results
    setShowResults(true);
    
    // Return the original content - processing is now handled internally
    return content;
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8 max-w-7xl">
      <header className="text-center mb-8 bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 shadow-sm border">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent mb-2">
          Privacy Guardian
        </h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Protect sensitive information and assess privacy risks with our comprehensive PII detection tools.
        </p>
      </header>
      
      <div className="grid grid-cols-1 gap-6">
        <ChatInterface 
          onAnalyze={handleAnalyzeContent} 
          processingEnabled={processingEnabled}
          setProcessingEnabled={setProcessingEnabled}
          processingMode={processingMode}
          setProcessingMode={setProcessingMode}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      </div>
      
      {showResults && piiResult && riskScore && flaggingResult && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <h2 className="text-xl font-bold">Privacy Analysis Results</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PiiHighlighter text={text} piiResult={piiResult} />
              <RiskScorer riskScore={riskScore} />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-2 w-2 bg-accent rounded-full"></div>
              <h2 className="text-xl font-bold">Privacy Tools</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PiiAnonymizer 
                text={text} 
                detectedPii={piiResult.detectedPii}
                initialMode={processingMode}
                initialCategories={selectedCategories} 
              />
              <PromptFlagger flaggingResult={flaggingResult} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
