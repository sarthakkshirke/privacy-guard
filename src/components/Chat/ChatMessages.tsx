
import React, { useRef, useEffect } from 'react';
import { Shield } from 'lucide-react';

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'file' | 'system';
  content: string;
  originalContent?: string;
  timestamp: Date;
  processed?: boolean;
  piiMatches?: any[];
}

interface ChatMessagesProps {
  messages: ChatMessage[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
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
  );
};

export default ChatMessages;
