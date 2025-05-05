
import React from 'react';
import { Settings, EyeOff, Eye, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import PiiProcessingOptions from '../PiiProcessingOptions';
import { ProcessingMode } from '../PiiProcessingOptions';
import { PiiCategory } from '@/utils/piiDetector';

interface ChatHeaderProps {
  processingEnabled: boolean;
  setProcessingEnabled: (enabled: boolean) => void;
  processingMode: ProcessingMode;
  setProcessingMode: (mode: ProcessingMode) => void;
  selectedCategories: PiiCategory[];
  setSelectedCategories: (categories: PiiCategory[]) => void;
  configOpen: boolean;
  setConfigOpen: (open: boolean) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  processingEnabled,
  setProcessingEnabled,
  processingMode,
  setProcessingMode,
  selectedCategories,
  setSelectedCategories,
  configOpen,
  setConfigOpen
}) => {
  return (
    <div className="sticky top-0 z-10 border-b border-gray-100 bg-white p-3 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-teal-600/10 flex items-center justify-center">
          <Shield className="h-4 w-4 text-teal-600" />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="font-medium text-base text-gray-800">Privacy Guardian</h3>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Dialog open={configOpen} onOpenChange={setConfigOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-8 flex items-center gap-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-gray-800">Privacy Configuration</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="text-sm font-medium text-gray-800">Process PII before sending</h4>
                <p className="text-xs text-gray-500">Automatically anonymize sensitive data</p>
              </div>
              <Switch 
                checked={processingEnabled} 
                onCheckedChange={setProcessingEnabled}
                className="data-[state=checked]:bg-teal-600"
              />
            </div>
            
            {processingEnabled && (
              <PiiProcessingOptions
                selectedMode={processingMode}
                selectedCategories={selectedCategories}
                onModeChange={setProcessingMode}
                onCategoriesChange={setSelectedCategories}
              />
            )}
            
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={() => setConfigOpen(false)}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Apply Settings
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
          processingEnabled 
            ? 'bg-teal-50 text-teal-700' 
            : 'bg-amber-50 text-amber-700'
        }`}>
          {processingEnabled ? (
            <>
              <EyeOff className="h-3 w-3 mr-1.5" />
              <span>Protected</span>
            </>
          ) : (
            <>
              <Eye className="h-3 w-3 mr-1.5" />
              <span>Raw Text</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
