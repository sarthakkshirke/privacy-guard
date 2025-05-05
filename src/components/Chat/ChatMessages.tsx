
import React, { useRef, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { format } from 'date-fns';

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
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
        >
          {message.type === 'bot' && (
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0">
              <Shield className="h-4 w-4 text-primary" />
            </div>
          )}
          
          <div 
            className={`max-w-[80%] rounded-lg p-3.5 ${
              message.type === 'user' 
                ? 'bg-primary text-primary-foreground rounded-br-none' 
                : message.type === 'system'
                ? 'bg-muted text-muted-foreground text-center w-full text-sm italic'
                : 'bg-secondary text-secondary-foreground rounded-bl-none'
            }`}
          >
            <div className="text-sm">{message.content}</div>
            
            {message.type !== 'system' && (
              <div className="mt-1 text-xs opacity-70">
                {format(new Date(message.timestamp), 'h:mm a')}
                
                {message.processed && message.type === 'user' && (
                  <span className="ml-2 flex items-center">
                    <Shield className="h-3 w-3 mr-1 inline" />
                    <span>Protected</span>
                  </span>
                )}
              </div>
            )}
          </div>
          
          {message.type === 'user' && (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center ml-2 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
