
import React from 'react';
import { Settings, EyeOff, Eye } from 'lucide-react';
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
    <div className="bg-primary/5 border-b px-4 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="h-3 w-3 bg-primary rounded-full animate-pulse-slow"></div>
        <h3 className="font-medium text-sm">Privacy Guardian Assistant</h3>
      </div>
      <div className="flex items-center space-x-2">
        <Dialog open={configOpen} onOpenChange={setConfigOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center space-x-1 text-xs h-8"
            >
              <Settings className="h-3.5 w-3.5 mr-1" />
              Privacy Config
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Privacy Configuration</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="text-sm font-medium">Process PII before sending</h4>
                <p className="text-xs text-gray-500">Automatically anonymize sensitive data</p>
              </div>
              <Switch 
                checked={processingEnabled} 
                onCheckedChange={setProcessingEnabled} 
                className="ml-2"
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
              >
                Apply Settings
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <div className="flex items-center px-2 py-1 rounded-full bg-primary/10 text-xs">
          {processingEnabled ? (
            <>
              <EyeOff className="h-3 w-3 text-primary mr-1" />
              <span>PII Protected</span>
            </>
          ) : (
            <>
              <Eye className="h-3 w-3 text-yellow-500 mr-1" />
              <span>Raw Text</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
