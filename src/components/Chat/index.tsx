
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { detectPii } from '@/utils/piiDetector';
import { anonymizePii } from '@/utils/pii';
import { PiiCategory } from '@/utils/piiDetector';
import { ProcessingMode } from '../PiiProcessingOptions';

import ChatHeader from './ChatHeader';
import ChatMessages, { ChatMessage } from './ChatMessages';
import ChatFileUpload from './ChatFileUpload';
import ChatInput from './ChatInput';
import PrivacyPrompt from './PrivacyPrompt';

interface ChatInterfaceProps {
  onAnalyze: (text: string, processBeforeSending?: boolean) => string;
  processingEnabled: boolean;
  setProcessingEnabled: (enabled: boolean) => void;
  processingMode: ProcessingMode;
  setProcessingMode: (mode: ProcessingMode) => void;
  selectedCategories: PiiCategory[];
  setSelectedCategories: (categories: PiiCategory[]) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onAnalyze,
  processingEnabled,
  setProcessingEnabled,
  processingMode,
  setProcessingMode,
  selectedCategories,
  setSelectedCategories
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m Privacy Guardian. Share your text or upload a document, and I\'ll analyze it for sensitive information.',
      timestamp: new Date()
    }
  ]);
  
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  
  const addMessage = (
    type: 'user' | 'bot' | 'file' | 'system',
    content: string,
    originalContent?: string,
    processed?: boolean,
    piiMatches?: any[]
  ) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      originalContent,
      timestamp: new Date(),
      processed,
      piiMatches
    };
    
    setMessages((prev) => [...prev, newMessage]);
  };
  
  const handleFileContent = (content: string) => {
    // Detect PII first to get consistent matches
    const piiDetectionResult = detectPii(content);
    
    // Process content before sending if enabled
    const processedContent = processingEnabled ?
      anonymizePii(content, piiDetectionResult.detectedPii, selectedCategories, processingMode) :
      content;
    
    addMessage('file', processingEnabled ? processedContent : content, content, processingEnabled,
      processingEnabled ? piiDetectionResult.detectedPii : undefined);
    
    onAnalyze(content, processingEnabled);
    
    if (processingEnabled) {
      addMessage('system', 'PII processing was applied to your file before analysis');
    }
    
    setShowFileUpload(false);
  };

  const handleSendMessage = (inputText: string) => {
    if (!inputText.trim()) return;
    
    // Detect PII first to get consistent matches
    const piiDetectionResult = detectPii(inputText);
    
    // Process text if enabled
    const processedText = processingEnabled ?
      anonymizePii(inputText, piiDetectionResult.detectedPii, selectedCategories, processingMode) :
      inputText;
    
    // Add message with either processed or original text depending on settings
    addMessage('user', processedText, inputText, processingEnabled,
      processingEnabled ? piiDetectionResult.detectedPii : undefined);
    
    // Process the text after a short delay for UI effect
    setTimeout(() => {
      onAnalyze(inputText, processingEnabled);
      addMessage('bot', 'I\'ve analyzed your text. Here are the results:');
    }, 500);
  };
  
  const handleSampleText = () => {
    const sampleText = `Hello, my name is John Smith and I'm sending this email from john.smith@example.com. 
    You can reach me at (555) 123-4567 or visit me at 123 Main Street, Springfield, IL 12345. 
    My social security number is 123-45-6789 and my credit card number is 4111-1111-1111-1111. 
    My patient ID is Patient ID: XYZ-123456 and this information is confidential. 
    I work for a large political organization that deals with sensitive government contracts.`;
    
    addMessage('system', 'Sample text loaded');
    handleSendMessage(sampleText);
  };

  const toggleFileUpload = () => {
    setShowFileUpload(!showFileUpload);
  };

  return (
    <Card className="relative flex flex-col h-[520px] overflow-hidden border shadow-lg rounded-xl bg-gradient-to-b from-white to-gray-50">
      <ChatHeader
        processingEnabled={processingEnabled}
        setProcessingEnabled={setProcessingEnabled}
        processingMode={processingMode}
        setProcessingMode={setProcessingMode}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        configOpen={configOpen}
        setConfigOpen={setConfigOpen}
      />
      
      <ChatMessages messages={messages} />
      
      <ChatFileUpload
        onFileContent={handleFileContent}
        showFileUpload={showFileUpload}
        setShowFileUpload={setShowFileUpload}
      />
      
      <ChatInput
        onSendMessage={handleSendMessage}
        onSampleText={handleSampleText}
        toggleFileUpload={toggleFileUpload}
      />
      
      <PrivacyPrompt visible={processingEnabled} />
    </Card>
  );
};

export default ChatInterface;
