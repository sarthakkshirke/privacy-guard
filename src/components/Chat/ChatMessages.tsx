
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
    <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4 gap-3`}
        >
          {message.type === 'bot' && (
            <div className="h-8 w-8 rounded-sm bg-chatgpt-assistant/10 flex items-center justify-center mr-1 flex-shrink-0">
              <Shield className="h-5 w-5 text-chatgpt-assistant" />
            </div>
          )}
          
          <div 
            className={`max-w-[80%] px-4 py-3.5 rounded-2xl ${
              message.type === 'user' 
                ? 'bg-chatgpt-user text-white' 
                : message.type === 'system'
                ? 'bg-muted text-muted-foreground text-center w-full text-sm italic'
                : 'bg-gray-100 dark:bg-gray-800 text-foreground'
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
            <div className="h-8 w-8 rounded-full bg-chatgpt-user/20 flex items-center justify-center ml-1 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-chatgpt-user" viewBox="0 0 20 20" fill="currentColor">
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
