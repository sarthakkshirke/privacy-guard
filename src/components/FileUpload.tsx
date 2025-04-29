
import React, { useState, ChangeEvent } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText } from 'lucide-react';
import { toast } from 'sonner';
import mammoth from 'mammoth';

// Import pdfjs directly for browser compatibility
import * as pdfjsLib from 'pdfjs-dist';

// Set workerSrc to enable PDF.js to work in browser
const pdfjsWorkerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc;

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
    
    // Check file type - only accept text, PDF, and Word documents
    const allowedTypes = [
      'text/plain', 
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(selectedFile.type) && 
        !selectedFile.name.endsWith('.txt') && 
        !selectedFile.name.endsWith('.pdf') && 
        !selectedFile.name.endsWith('.doc') && 
        !selectedFile.name.endsWith('.docx')) {
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

  const readPdfFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        if (!e.target?.result) {
          reject(new Error('Failed to read PDF file'));
          return;
        }
        
        try {
          const typedArray = new Uint8Array(e.target.result as ArrayBuffer);
          
          // Using PDF.js for browser compatibility
          const loadingTask = pdfjsLib.getDocument({ data: typedArray });
          const pdf = await loadingTask.promise;
          
          let fullText = '';
          
          // Extract text from all pages
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(' ');
            
            fullText += pageText + '\n';
          }
          
          resolve(fullText);
        } catch (err) {
          console.error('Error parsing PDF:', err);
          reject(new Error('Failed to parse PDF file'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading PDF file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

  const readDocFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        if (!e.target?.result) {
          reject(new Error('Failed to read Word document'));
          return;
        }
        
        try {
          const arrayBuffer = e.target.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (err) {
          console.error('Failed to parse Word document:', err);
          reject(new Error('Failed to parse Word document'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading Word document'));
      };
      
      reader.readAsArrayBuffer(file);
    });
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
