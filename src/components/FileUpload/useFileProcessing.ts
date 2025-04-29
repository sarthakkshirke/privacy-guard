
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  validateFile, 
  readTextFile, 
  readPdfFile, 
  readDocFile 
} from '@/utils/fileHandlers';

export interface UseFileProcessingProps {
  onFileContent: (content: string) => void;
}

export const useFileProcessing = ({ onFileContent }: UseFileProcessingProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (selectedFile: File) => {
    setError(null);
    
    const { valid, error } = validateFile(selectedFile);
    
    if (!valid) {
      setError(error);
      return;
    }
    
    setFile(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let text = '';
      
      // Process based on file type
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        text = await readTextFile(file);
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        try {
          text = await readPdfFile(file);
        } catch (err) {
          console.error('PDF extraction failed:', err);
          toast.error('Could not extract PDF content properly');
          // Provide minimal fallback content
          text = `Could not fully extract content from ${file.name}. The PDF may be scanned or protected.`;
        }
      } else if (
        file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.endsWith('.doc') || 
        file.name.endsWith('.docx')
      ) {
        try {
          text = await readDocFile(file);
        } catch (err) {
          console.error('Word extraction failed:', err);
          toast.error('Could not extract Word document content properly');
          // Provide minimal fallback content
          text = `Could not fully extract content from ${file.name}. The document may be protected.`;
        }
      } else {
        throw new Error('Unsupported file type');
      }
      
      // Process the text content
      if (text) {
        onFileContent(text);
        toast.success(`Successfully processed "${file.name}"`);
      } else {
        throw new Error('No content could be extracted from the file');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setError(`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error('Failed to process file');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    file,
    error,
    isLoading,
    handleFileChange,
    clearFile,
    handleUpload
  };
};
