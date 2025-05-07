import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Upload, Paperclip, FileText, Shield, Eye, EyeOff, Settings } from 'lucide-react';
import { useFileProcessing } from './FileUpload/useFileProcessing';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PiiProcessingOptions from './PiiProcessingOptions';
import { PiiCategory } from '@/utils/piiDetector';
import { detectPii } from '@/utils/piiDetector';
import { anonymizePii } from '@/utils/pii';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'file' | 'system';
  content: string;
  originalContent?: string; // Original content before processing
  timestamp: Date;
  processed?: boolean; // Flag indicating if the content has been processed
  piiMatches?: any[]; // Store PII matches to ensure consistency
}

interface ChatInterfaceProps {
  onAnalyze: (text: string, processBeforeSending?: boolean) => string;
  processingEnabled: boolean;
  setProcessingEnabled: (enabled: boolean) => void;
  processingMode: 'anonymize' | 'redact' | 'encrypt';
  setProcessingMode: (mode: 'anonymize' | 'redact' | 'encrypt') => void;
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
  const [inputText, setInputText] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [configOpen, setConfigOpen] = useState(false);
  
  const {
    file,
    error,
    isLoading,
    handleFileChange,
    clearFile,
    handleUpload
  } = useFileProcessing({ 
    onFileContent: (content) => {
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
    }
  });

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

  const handleSendMessage = () => {
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
    
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSampleText = () => {
    const sampleText = `Hello, my name is John Smith and I'm sending this email from john.smith@example.com. 
    You can reach me at (555) 123-4567 or visit me at 123 Main Street, Springfield, IL 12345. 
    My social security number is 123-45-6789 and my credit card number is 4111-1111-1111-1111. 
    My patient ID is Patient ID: XYZ-123456 and this information is confidential. 
    I work for a large political organization that deals with sensitive government contracts.`;
    
    addMessage('system', 'Sample text loaded');
    setInputText(sampleText);
  };

  const toggleFileUpload = () => {
    setShowFileUpload(!showFileUpload);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Card className="relative flex flex-col overflow-hidden border shadow-lg rounded-xl bg-gradient-to-b from-white to-gray-50">
      <div className="bg-primary/5 border-b px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-primary rounded-full animate-pulse-slow"></div>
          <h3 className="font-medium text-sm">Privacy Guardian Assistant</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={configOpen} onOpenChange={setConfigOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center space-x-1 text-xs h-8"
              >
                <Settings className="h-3.5 w-3.5 mr-1" />
                Privacy Config
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Privacy Configuration</DialogTitle>
              </DialogHeader>
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-sm font-medium">Process PII before sending</h4>
                  <p className="text-xs text-gray-500">Automatically anonymize sensitive data</p>
                </div>
                <Switch 
                  checked={processingEnabled} 
                  onCheckedChange={setProcessingEnabled} 
                  className="ml-2"
                />
              </div>
              
              {processingEnabled && (
                <PiiProcessingOptions
                  selectedMode={processingMode}
                  selectedCategories={selectedCategories}
                  onModeChange={setProcessingMode}
                  onCategoriesChange={setSelectedCategories}
                />
              )}
              
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={() => setConfigOpen(false)}
                >
                  Apply Settings
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <div className="flex items-center px-2 py-1 rounded-full bg-primary/10 text-xs">
            {processingEnabled ? (
              <>
                <EyeOff className="h-3 w-3 text-primary mr-1" />
                <span>PII Protected</span>
              </>
            ) : (
              <>
                <Eye className="h-3 w-3 text-yellow-500 mr-1" />
                <span>Raw Text</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : message.type === 'system'
                  ? 'bg-muted text-muted-foreground text-center w-full text-sm italic'
                  : 'bg-secondary text-secondary-foreground shadow-sm'
              }`}
            >
              {message.content}
              {message.processed && message.type === 'user' && (
                <div className="mt-1.5 pt-1.5 border-t border-primary/10 text-xs flex items-center">
                  <Shield className="h-3 w-3 mr-1 opacity-70" />
                  <span className="opacity-70">PII protected</span>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {showFileUpload && (
        <div className="p-4 bg-gray-50 border-t">
          <div className="space-y-2">
            {!file ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      handleFileChange(selectedFile);
                    }
                  }}
                  accept=".txt,.pdf,.doc,.docx"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="h-8 w-8 text-primary/70 mb-2" />
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">TXT, PDF, DOC up to 10MB</p>
                </label>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border shadow-sm">
                <div className="flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={clearFile}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleUpload} disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Analyze'}
                  </Button>
                </div>
              </div>
            )}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        </div>
      )}

      <div className="p-4 border-t bg-white flex gap-2 items-end">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleFileUpload} 
          className="flex-shrink-0 text-gray-600 hover:text-primary hover:border-primary transition-colors"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="w-full min-h-[40px] resize-none focus:ring-primary"
            onKeyDown={handleKeyPress}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSampleText}
            className="flex-shrink-0 text-xs"
          >
            Sample
          </Button>
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputText.trim()} 
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {processingEnabled && (
        <div className="absolute bottom-[72px] left-0 right-0 px-4 py-2 bg-green-50 border-t border-green-100 text-xs text-green-700 flex items-center justify-center">
          <Shield className="h-3 w-3 mr-1" />
          <span>PII protection enabled - Your text will be processed before sending</span>
        </div>
      )}
    </Card>
  );
};

export default ChatInterface;
