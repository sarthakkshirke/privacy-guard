
import React from 'react';
import { Shield } from 'lucide-react';

interface PrivacyPromptProps {
  visible: boolean;
}

const PrivacyPrompt: React.FC<PrivacyPromptProps> = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <div className="absolute bottom-[72px] left-0 right-0 px-4 py-2.5 bg-teal-50 border-t border-teal-100 text-xs text-teal-700 flex items-center justify-center gap-1.5 z-10">
      <Shield className="h-3.5 w-3.5" />
      <span className="font-medium">PII protection enabled</span>
      <span className="opacity-80">• Your text will be processed before sending</span>
    </div>
  );
};

export default PrivacyPrompt;
