
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
    <div className="flex-1 overflow-y-auto">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`px-4 py-6 ${message.type === 'user' ? 'bg-white' : 'bg-gray-50'}`}
        >
          <div className="max-w-3xl mx-auto flex gap-4">
            {message.type === 'bot' && (
              <div className="w-7 h-7 rounded-sm bg-teal-600 flex items-center justify-center flex-shrink-0">
                <Shield className="h-4 w-4 text-white" />
              </div>
            )}
            
            <div className="flex-1 min-w-0 whitespace-pre-wrap">
              {message.content}
              
              {message.type !== 'system' && (
                <div className="mt-1.5 text-xs text-gray-500">
                  {format(new Date(message.timestamp), 'h:mm a')}
                  
                  {message.processed && message.type === 'user' && (
                    <span className="ml-2 flex items-center text-teal-600">
                      <Shield className="h-3 w-3 mr-1 inline" />
                      <span>Protected</span>
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {message.type === 'user' && (
              <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
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
