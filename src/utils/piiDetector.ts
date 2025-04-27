
// PII categories and regular expressions for detection
export type PiiCategory = 'name' | 'email' | 'phone' | 'address' | 'id' | 'financial' | 'health' | 'other';

export interface PiiMatch {
  text: string;
  startIndex: number;
  endIndex: number;
  category: PiiCategory;
  anonymized?: string;
}

export interface PiiResult {
  detectedPii: PiiMatch[];
  piiCount: Record<PiiCategory, number>;
  totalPiiCount: number;
}

// Simplified PII detection patterns (in a real application, these would be more sophisticated)
const PII_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g,
  // Simple patterns for demo purposes
  name: /\b([A-Z][a-z]+)\s+([A-Z][a-z]+)\b/g, // Simplified name pattern
  address: /\b\d+\s+[A-Za-z\s]+,\s+[A-Za-z\s]+,\s+[A-Z]{2}\s+\d{5}\b/g,
  id: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g, // SSN-like
  financial: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g, // Credit card-like
  health: /\b(?:Patient|Medical Record|Diagnosis|Treatment)\s+ID:?\s*[A-Z0-9\-]+\b/gi,
};

// Function to detect PII in text
export const detectPii = (text: string): PiiResult => {
  const detectedPii: PiiMatch[] = [];
  const piiCount: Record<PiiCategory, number> = {
    name: 0,
    email: 0,
    phone: 0,
    address: 0,
    id: 0,
    financial: 0,
    health: 0,
    other: 0,
  };

  // For each PII category, find all matches in the text
  Object.entries(PII_PATTERNS).forEach(([category, pattern]) => {
    const matches = [...text.matchAll(new RegExp(pattern, 'g'))];
    
    matches.forEach((match) => {
      const matchText = match[0];
      const startIndex = match.index || 0;
      const endIndex = startIndex + matchText.length;
      
      detectedPii.push({
        text: matchText,
        startIndex,
        endIndex,
        category: category as PiiCategory,
      });
      
      piiCount[category as PiiCategory] += 1;
    });
  });

  // Sort detected PII by start index to maintain original text order
  detectedPii.sort((a, b) => a.startIndex - b.startIndex);
  
  // Calculate total PII count
  const totalPiiCount = Object.values(piiCount).reduce((a, b) => a + b, 0);

  return {
    detectedPii,
    piiCount,
    totalPiiCount,
  };
};

// Function to generate highlighted text with PII markers
export const generateHighlightedText = (text: string, piiMatches: PiiMatch[]): JSX.Element[] => {
  if (piiMatches.length === 0) {
    return [<span key="0">{text}</span>];
  }

  const result: JSX.Element[] = [];
  let lastIndex = 0;

  piiMatches.forEach((match, index) => {
    // Add text before the PII
    if (match.startIndex > lastIndex) {
      result.push(
        <span key={`text-${index}`}>
          {text.substring(lastIndex, match.startIndex)}
        </span>
      );
    }

    // Add the highlighted PII
    result.push(
      <mark 
        key={`pii-${index}`} 
        className={`pii-highlight pii-${match.category}`}
        title={`PII Type: ${match.category}`}
      >
        {match.text}
      </mark>
    );

    lastIndex = match.endIndex;
  });

  // Add any remaining text after the last PII
  if (lastIndex < text.length) {
    result.push(
      <span key={`text-last`}>
        {text.substring(lastIndex)}
      </span>
    );
  }

  return result;
};
