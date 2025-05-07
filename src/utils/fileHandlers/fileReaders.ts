
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import { toast } from 'sonner';

// Configure PDF.js worker with proper fallback handling
const loadPdfWorker = () => {
  // For web environments
  if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
    // Use CDN for web version
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  } else {
    // For Electron, use the bundled worker
    try {
      // Use the worker from the same package
      const workerPath = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url);
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath.href;
    } catch (err) {
      console.error('Failed to set PDF.js worker path:', err);
      // Last resort fallback
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }
  }
};

// Initialize worker on module load
loadPdfWorker();

export const readTextFile = async (file: File): Promise<string> => {
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

export const readPdfFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      if (!e.target?.result) {
        reject(new Error('Failed to read PDF file'));
        return;
      }
      
      try {
        console.log('Starting PDF extraction...');
        const typedArray = new Uint8Array(e.target.result as ArrayBuffer);
        
        // Ensure worker is initialized
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
          loadPdfWorker();
        }
        
        // Create a loading task with more robust error handling
        const loadingTask = pdfjsLib.getDocument({
          data: typedArray,
          useSystemFonts: true, // Better font support
          disableFontFace: false // Allow custom fonts
        });
        
        console.log('PDF loading task created');
        
        const pdf = await Promise.race([
          loadingTask.promise,
          new Promise((_, reject) => setTimeout(() => reject(new Error('PDF loading timed out')), 30000))
        ]) as pdfjsLib.PDFDocumentProxy;
        
        console.log(`PDF loaded successfully with ${pdf.numPages} pages`);
        
        let fullText = '';
        
        // Extract text from all pages with progress logging
        for (let i = 1; i <= pdf.numPages; i++) {
          console.log(`Processing page ${i} of ${pdf.numPages}`);
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          
          fullText += pageText + '\n';
        }
        
        if (!fullText || fullText.trim() === '') {
          console.warn('No text content found in PDF');
          reject(new Error('No text content found in PDF'));
          return;
        }
        
        console.log('PDF extraction completed successfully');
        resolve(fullText);
      } catch (err) {
        console.error('Error parsing PDF:', err);
        reject(new Error(`Failed to parse PDF file: ${err instanceof Error ? err.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading PDF file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const readDocFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      if (!e.target?.result) {
        reject(new Error('Failed to read Word document'));
        return;
      }
      
      try {
        console.log('Starting Word document extraction...');
        const arrayBuffer = e.target.result as ArrayBuffer;
        
        // Use a timeout to prevent hanging on corrupt files
        const result = await Promise.race([
          mammoth.extractRawText({ arrayBuffer }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Word document processing timed out')), 30000))
        ]) as { value: string };
        
        if (!result.value || result.value.trim() === '') {
          console.warn('No text content found in Word document');
          reject(new Error('No text content found in Word document'));
          return;
        }
        
        console.log('Word document extraction completed successfully');
        resolve(result.value);
      } catch (err) {
        console.error('Failed to parse Word document:', err);
        reject(new Error(`Failed to parse Word document: ${err instanceof Error ? err.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading Word document'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
