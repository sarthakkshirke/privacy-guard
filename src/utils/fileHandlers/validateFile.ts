
export const validateFile = (file: File): { valid: boolean; error: string | null } => {
  // Check file type - only accept text, PDF, and Word documents
  const allowedTypes = [
    'text/plain', 
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (!allowedTypes.includes(file.type) && 
      !file.name.endsWith('.txt') && 
      !file.name.endsWith('.pdf') && 
      !file.name.endsWith('.doc') && 
      !file.name.endsWith('.docx')) {
    return { 
      valid: false, 
      error: 'Please upload a text, PDF, or Word document.' 
    };
  }
  
  // Check file size - limit to 10MB
  if (file.size > 10 * 1024 * 1024) {
    return { 
      valid: false, 
      error: 'File size must be less than 10MB.' 
    };
  }
  
  return { valid: true, error: null };
};
