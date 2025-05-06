
import React from 'react';
import { Shield } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface PrivacyPromptProps {
  visible: boolean;
  enabled: boolean;
  onToggle: () => void;
}

const PrivacyPrompt: React.FC<PrivacyPromptProps> = ({ visible, enabled, onToggle }) => {
  if (!visible) return null;
  
  return (
    <div className="absolute bottom-[72px] left-0 right-0 px-4 py-2.5 bg-teal-50 border-t border-teal-100 text-xs text-teal-700 flex items-center justify-between gap-1.5 z-10">
      <div className="flex items-center gap-1.5">
        <Shield className="h-3.5 w-3.5" />
        <span className="font-medium">PII protection</span>
        <span className="opacity-80">• Your text will be processed before sending</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs">{enabled ? 'On' : 'Off'}</span>
        <Switch 
          checked={enabled} 
          onCheckedChange={onToggle}
          className="h-[18px] w-[32px]"
        />
      </div>
    </div>
  );
};

export default PrivacyPrompt;
