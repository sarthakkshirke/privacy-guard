
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import { toast } from 'sonner';

// Configure PDF.js worker with proper fallback handling for cross-platform support
const loadPdfWorker = () => {
  console.log('Loading PDF worker...');
  
  // Access electron platform info if available
  const isElectron = typeof window !== 'undefined' && window.electron;
  const electronPlatform = isElectron ? window.electron.fileSystem.platform : null;
  
  // For web environments
  if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
    console.log('Web environment detected, using CDN for PDF worker');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  } 
  // For Electron on any platform
  else if (isElectron) {
    try {
      console.log('Electron environment detected');
      // Use the worker from the same package with proper path handling
      const workerPath = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url);
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath.href;
      console.log('Set PDF worker path:', pdfjsLib.GlobalWorkerOptions.workerSrc);
    } catch (err) {
      console.error('Failed to set PDF.js worker path in Electron:', err);
      // Fallback to CDN
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }
  } 
  // Unknown environment, try best effort
  else {
    console.warn('Unknown environment, using fallback PDF worker config');
    try {
      const workerPath = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url);
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath.href;
    } catch (err) {
      console.error('Failed to set PDF.js worker path:', err);
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }
  }
  
  console.log('PDF worker source set to:', pdfjsLib.GlobalWorkerOptions.workerSrc);
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
