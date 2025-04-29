
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, X } from 'lucide-react';

interface FilePreviewProps {
  file: File;
  onClear: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onClear }) => {
  return (
    <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
      <div className="flex items-center space-x-3">
        <FileText className="h-6 w-6 text-blue-600" />
        <div>
          <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onClear}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FilePreview;
