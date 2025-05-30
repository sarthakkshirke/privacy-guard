
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
      
      // Show processing toast
      const toastId = toast.loading(`Processing ${file.name}...`);
      
      try {
        console.log(`Processing file: ${file.name} (${file.type})`);
        
        // Process based on file type
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          text = await readTextFile(file);
          console.log('Text file processed successfully');
        } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          try {
            text = await readPdfFile(file);
            if (!text || text.trim() === '') {
              throw new Error('PDF appears to be empty or contains no extractable text');
            }
          } catch (err) {
            console.error('PDF extraction failed:', err);
            toast.error('Could not extract PDF content properly');
            throw new Error(`PDF extraction failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
          }
        } else if (
          file.type === 'application/msword' || 
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.name.endsWith('.doc') || 
          file.name.endsWith('.docx')
        ) {
          try {
            text = await readDocFile(file);
            console.log('Word document processed successfully');
          } catch (err) {
            console.error('Word extraction failed:', err);
            toast.error('Could not extract Word document content properly');
            throw new Error(`Word document extraction failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
          }
        } else {
          throw new Error('Unsupported file type');
        }
        
        // Update toast with success message
        toast.success(`${file.name} processed successfully`, { id: toastId });
      } catch (err) {
        // Update toast with error message
        toast.error(`Failed to process ${file.name}`, { id: toastId });
        throw err;
      }
      
      // Process the text content
      if (text) {
        console.log(`Extracted content length: ${text.length} characters`);
        // Truncate very large files for logging
        console.log(`Content sample: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
        
        // Directly call onFileContent with the extracted text
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
