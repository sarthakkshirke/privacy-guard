
import React, { useState, ChangeEvent } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileContent: (content: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileContent }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    
    if (!selectedFile) {
      return;
    }
    
    // Check file type - only accept text-based files
    const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.txt')) {
      setError('Please upload a text, PDF, or Word document.');
      return;
    }
    
    // Check file size - limit to 10MB
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }
    
    setFile(selectedFile);
  };

  const readTextFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to read file content'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    });
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // For text files, read the full content directly
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        try {
          const text = await readTextFile(file);
          onFileContent(text);
          toast.success(`Successfully processed "${file.name}"`);
        } catch (err) {
          console.error('Failed to read file content:', err);
          setError('Failed to read file content.');
          toast.error('Failed to read file content');
        }
      } else if (file.type.includes('pdf') || file.type.includes('word')) {
        // For PDF and Word files, we can only extract text in a browser environment
        // using specialized libraries. For this demo, we'll simulate with sample text.
        
        // In a real application, you'd use a library like pdf.js for PDFs or
        // integrate with a backend service that can extract text from these formats
        
        setTimeout(() => {
          const fileName = file.name;
          toast.success(`Processed "${fileName}" with simulated content`);
          
          const simulatedText = `This is extracted content from ${fileName}. 
          It contains PII for Jane Doe who can be reached at jane.doe@company.org or 
          (555) 987-6543. Her employee ID is 987-65-4321 and she lives at 
          456 Business Ave, Enterprise City, CA 94321.
          This document is marked as confidential and internal use only.
          
          The document also contains financial information about the Q3 revenue: $2,456,789.00.
          Bank account information: 1234-5678-9012-3456 with routing number 987654321.
          
          Patient medical records indicate treatment for chronic conditions by Dr. Smith
          at Memorial Hospital. Prescription for medication XYZ was filled on 2023-04-15.
          
          Please keep this information secure and do not distribute. Authorized personnel only.
          
          CONFIDENTIAL - SECRET - INTERNAL USE ONLY
          
          Additional contact: John Smith, john.smith@company.org, (555) 123-4567
          Additional ID: SSN 123-45-6789
          Additional address: 123 Main St, Anytown, NY 12345`;
          
          onFileContent(simulatedText);
        }, 1000);
      } else {
        setError('Unsupported file format.');
        toast.error('Unsupported file format');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setError('Failed to process file.');
      toast.error('Failed to process file');
    } finally {
      setIsLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Upload File</h3>
          
          {!file ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 cursor-pointer">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".txt,.pdf,.doc,.docx"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">TXT, PDF, DOC up to 10MB</p>
              </label>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={clearFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleUpload} 
          disabled={!file || isLoading}
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
      </CardFooter>
    </Card>
  );
};

export default FileUpload;
