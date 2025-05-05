
import React from 'react';
import { Shield } from 'lucide-react';

interface PrivacyPromptProps {
  visible: boolean;
}

const PrivacyPrompt: React.FC<PrivacyPromptProps> = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <div className="absolute bottom-[72px] left-0 right-0 px-4 py-2 bg-green-50 border-t border-green-100 text-xs text-green-700 flex items-center justify-center">
      <Shield className="h-3 w-3 mr-1" />
      <span>PII protection enabled - Your text will be processed before sending</span>
    </div>
  );
};

export default PrivacyPrompt;
