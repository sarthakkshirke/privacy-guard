
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
    <div className="px-3 pt-3 border-t flex gap-2 items-center relative bg-white pb-3">
      
      <div className="flex-1 relative">
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Message Privacy Guardian..."
          className="h-10 min-h-[40px] max-h-[200px] p-2 pr-12 resize-none focus:ring-0 focus:ring-offset-0 rounded-xl border border-gray-300 focus:border-gray-400 shadow-sm bg-white text-gray-800"
          onKeyDown={handleKeyPress}
        />
        <Button 
          onClick={handleSend}
          disabled={!inputText.trim()}
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-teal-600 hover:bg-teal-700 rounded-lg disabled:bg-gray-300"
        >
          <Send className="h-4 w-4 text-white" />
        </Button>
      </div>
      
      <div className="flex gap-1.5">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleFileUpload}
          className="h-10 w-10 flex-shrink-0 text-gray-500 rounded-lg hover:text-teal-600 hover:border-teal-600 border-gray-300"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline"
          size="sm" 
          onClick={onSampleText}
          className="flex-shrink-0 text-xs h-10 whitespace-nowrap border-gray-300 hover:border-teal-600 hover:text-teal-600 rounded-lg"
        >
          Sample Text
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
