
import React, { useState } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import PrivacyPrompt from './PrivacyPrompt';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onSampleText: () => void;
  toggleFileUpload: () => void;
  privacyEnabled: boolean;
  onPrivacyToggle: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onSampleText, 
  toggleFileUpload,
  privacyEnabled,
  onPrivacyToggle
}) => {
  const [inputText, setInputText] = useState('');
  const [showPrivacyPrompt, setShowPrivacyPrompt] = useState(true);

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
      <PrivacyPrompt 
        visible={showPrivacyPrompt} 
        enabled={privacyEnabled}
        onToggle={onPrivacyToggle}
      />
      
      <div className="flex-1 relative">
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Message Privacy Guardian..."
          className="min-h-[56px] max-h-[200px] p-3 pr-12 resize-none focus:ring-0 focus:ring-offset-0 rounded-xl border border-gray-300 focus:border-gray-400 shadow-sm bg-white text-gray-800"
          onKeyDown={handleKeyPress}
        />
        <Button 
          onClick={handleSend} 
          disabled={!inputText.trim()} 
          size="icon"
          className="absolute right-2 bottom-2 h-8 w-8 bg-teal-600 hover:bg-teal-700 rounded-lg disabled:bg-gray-300"
        >
          <Send className="h-4 w-4 text-white" />
        </Button>
      </div>
      
      <div className="flex gap-1.5">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleFileUpload} 
          className="flex-shrink-0 text-gray-500 h-10 w-10 rounded-lg hover:text-teal-600 hover:border-teal-600 border-gray-300"
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
