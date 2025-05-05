
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
    <div className="p-3 border-t flex gap-2 items-end relative bg-white">
      <div className="flex-1 relative border rounded-lg bg-chatgpt-input">
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Message Privacy Guardian..."
          className="min-h-[48px] max-h-[200px] p-3 pr-12 resize-none focus:ring-0 focus:ring-offset-0 border-none shadow-none bg-chatgpt-input"
          onKeyDown={handleKeyPress}
        />
        <Button 
          onClick={handleSend} 
          disabled={!inputText.trim()} 
          size="icon"
          className="absolute right-2 bottom-1.5 h-8 w-8 bg-chatgpt-user rounded-md hover:bg-chatgpt-user/90"
        >
          <Send className="h-4 w-4 text-white" />
        </Button>
      </div>
      
      <div className="flex gap-1.5">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleFileUpload} 
          className="flex-shrink-0 text-muted-foreground h-10 w-10 rounded-md hover:text-chatgpt-assistant hover:border-chatgpt-assistant transition-colors"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSampleText}
          className="flex-shrink-0 text-xs h-10 whitespace-nowrap"
        >
          Sample Text
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
