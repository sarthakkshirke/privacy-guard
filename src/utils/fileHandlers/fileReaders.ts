
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js to use built-in worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsLib.PDFWorker ? '' : undefined;

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
        const typedArray = new Uint8Array(e.target.result as ArrayBuffer);
        
        // Use PDF.js with simplified configuration
        const loadingTask = pdfjsLib.getDocument({ data: typedArray });
        console.log('PDF loading task created');
        
        const pdf = await loadingTask.promise;
        console.log(`PDF loaded successfully with ${pdf.numPages} pages`);
        
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
        
        if (!fullText || fullText.trim() === '') {
          reject(new Error('No text content found in PDF'));
          return;
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

export const readDocFile = async (file: File): Promise<string> => {
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
