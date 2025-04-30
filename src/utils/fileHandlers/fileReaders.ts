import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

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
        
        // Using pdf-parse instead of pdf.js
        const data = await pdfParse(typedArray);
        const text = data.text;
        
        if (!text || text.trim() === '') {
          reject(new Error('No text content found in PDF'));
          return;
        }
        
        resolve(text);
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
