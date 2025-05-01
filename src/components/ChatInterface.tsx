
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Upload, Paperclip, FileText } from 'lucide-react';
import { useFileProcessing } from './FileUpload/useFileProcessing';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'file' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onAnalyze: (text: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onAnalyze }) => {
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
  
  const {
    file,
    error,
    isLoading,
    handleFileChange,
    clearFile,
    handleUpload
  } = useFileProcessing({ 
    onFileContent: (content) => {
      addMessage('file', `File analyzed: ${file?.name}`);
      onAnalyze(content);
      setShowFileUpload(false);
    }
  });

  const addMessage = (type: 'user' | 'bot' | 'file' | 'system', content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    addMessage('user', inputText);
    
    // Process the text after a short delay for UI effect
    setTimeout(() => {
      onAnalyze(inputText);
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
    <Card className="relative flex flex-col h-[500px] overflow-hidden border-2 shadow-md">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : message.type === 'system'
                  ? 'bg-muted text-muted-foreground text-center w-full text-sm italic'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {showFileUpload && (
        <div className="p-4 bg-gray-50 border-t">
          <div className="space-y-2">
            {!file ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer">
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
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">TXT, PDF, DOC up to 10MB</p>
                </label>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-blue-600" />
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

      <div className="p-4 border-t flex gap-2 items-end">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleFileUpload} 
          className="flex-shrink-0"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="w-full min-h-[40px] resize-none"
            onKeyDown={handleKeyPress}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSampleText}
            className="flex-shrink-0"
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
    </Card>
  );
};

export default ChatInterface;
