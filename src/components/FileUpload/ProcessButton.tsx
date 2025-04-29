
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface ProcessButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const ProcessButton: React.FC<ProcessButtonProps> = ({ 
  onClick, 
  isLoading, 
  disabled 
}) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={disabled}
      className="gap-2"
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Processing...
        </>
      ) : (
        <>
          <FileText className="h-4 w-4" />
          Upload & Analyze
        </>
      )}
    </Button>
  );
};

export default ProcessButton;
