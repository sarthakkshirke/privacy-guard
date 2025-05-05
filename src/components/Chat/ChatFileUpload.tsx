
import React from 'react';
import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFileProcessing } from '../FileUpload/useFileProcessing';

interface ChatFileUploadProps {
  onFileContent: (content: string) => void;
  showFileUpload: boolean;
  setShowFileUpload: (show: boolean) => void;
}

const ChatFileUpload: React.FC<ChatFileUploadProps> = ({ 
  onFileContent, 
  showFileUpload, 
  setShowFileUpload 
}) => {
  const {
    file,
    error,
    isLoading,
    handleFileChange,
    clearFile,
    handleUpload
  } = useFileProcessing({ onFileContent });

  if (!showFileUpload) {
    return null;
  }

  return (
    <div className="p-4 bg-gray-50 border-t">
      <div className="space-y-2">
        {!file ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  handleFileChange(selectedFile);
                }
              }}
              accept=".txt,.pdf,.doc,.docx"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <div className="h-8 w-8 text-primary/70 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p className="text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">TXT, PDF, DOC up to 10MB</p>
            </label>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-white p-3 rounded-lg border shadow-sm">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={clearFile}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleUpload} disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Analyze'}
              </Button>
            </div>
          </div>
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
};

export default ChatFileUpload;
