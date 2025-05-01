
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import DropZone from './DropZone';
import FilePreview from './FilePreview';
import ProcessButton from './ProcessButton';
import { useFileProcessing } from './useFileProcessing';

interface FileUploadProps {
  onFileContent: (content: string) => void;
}

// This component is now used internally by ChatInterface
// It's kept here for compatibility with existing code
const FileUpload: React.FC<FileUploadProps> = ({ onFileContent }) => {
  const {
    file,
    error,
    isLoading,
    handleFileChange,
    clearFile,
    handleUpload
  } = useFileProcessing({ onFileContent });

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Upload File</h3>
          
          {!file ? (
            <DropZone onFileChange={handleFileChange} />
          ) : (
            <FilePreview file={file} onClear={clearFile} />
          )}
          
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <ProcessButton 
          onClick={handleUpload} 
          disabled={!file || isLoading}
          isLoading={isLoading}
        />
      </CardFooter>
    </Card>
  );
};

export default FileUpload;
