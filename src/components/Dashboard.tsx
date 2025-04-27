
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TextInput from './TextInput';
import FileUpload from './FileUpload';
import PiiHighlighter from './PiiHighlighter';
import RiskScorer from './RiskScorer';
import PiiAnonymizer from './PiiAnonymizer';
import PromptFlagger from './PromptFlagger';
import { detectPii, PiiResult } from '@/utils/piiDetector';
import { calculateRiskScore, RiskScore } from '@/utils/riskScorer';
import { flagContent, FlaggingResult } from '@/utils/contentFlagger';
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
      
      <Tabs defaultValue="text">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Text Input
          </TabsTrigger>
          <TabsTrigger value="file" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            File Upload
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          <TextInput onAnalyze={handleAnalyzeContent} />
        </TabsContent>
        
        <TabsContent value="file">
          <FileUpload onFileContent={handleAnalyzeContent} />
        </TabsContent>
      </Tabs>
      
      {showResults && piiResult && riskScore && flaggingResult && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Preview & Risk Summary</h2>
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
