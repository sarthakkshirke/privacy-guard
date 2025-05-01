
import React, { useState } from 'react';
import { detectPii, PiiResult } from '@/utils/piiDetector';
import { calculateRiskScore, RiskScore } from '@/utils/riskScorer';
import { flagContent, FlaggingResult } from '@/utils/contentFlagger';
import ChatInterface from './ChatInterface';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RiskScorer from './RiskScorer';
import PiiHighlighter from './PiiHighlighter';
import PiiAnonymizer from './PiiAnonymizer';
import PromptFlagger from './PromptFlagger';
import { Shield, FileText } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [piiResult, setPiiResult] = useState<PiiResult | null>(null);
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [flaggingResult, setFlaggingResult] = useState<FlaggingResult | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  const handleAnalyzeContent = (content: string) => {
    setText(content);
    
    // Detect PIIs
    const detectedPiiResult = detectPii(content);
    setPiiResult(detectedPiiResult);
    
    // Calculate risk score
    const calculatedRiskScore = calculateRiskScore(content, detectedPiiResult);
    setRiskScore(calculatedRiskScore);
    
    // Flag content
    const flagResult = flagContent(content);
    setFlaggingResult(flagResult);
    
    // Show results
    setShowResults(true);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Privacy Guardian
        </h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Protect sensitive information and assess privacy risks with our comprehensive PII detection tools.
        </p>
      </header>
      
      <ChatInterface onAnalyze={handleAnalyzeContent} />
      
      {showResults && piiResult && riskScore && flaggingResult && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Privacy Analysis Results</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PiiHighlighter text={text} piiResult={piiResult} />
              <RiskScorer riskScore={riskScore} />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Privacy Tools</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PiiAnonymizer text={text} detectedPii={piiResult.detectedPii} />
              <PromptFlagger flaggingResult={flaggingResult} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
