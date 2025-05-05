
import React, { useState } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onSampleText: () => void;
  toggleFileUpload: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onSampleText, 
  toggleFileUpload 
}) => {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
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
          onClick={onSampleText}
          className="flex-shrink-0 text-xs"
        >
          Sample
        </Button>
        <Button 
          onClick={handleSend} 
          disabled={!inputText.trim()} 
          className="flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
