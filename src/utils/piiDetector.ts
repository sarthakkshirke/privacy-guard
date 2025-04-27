// PII categories and regular expressions for detection
import React from 'react';

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
  name: /\b([A-Z][a-z]+)\s+([A-Z][a-z]+)\b/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g,
  address: /\b\d+\s+[A-Za-z\s]+,\s+[A-Za-z\s]+,\s+[A-Z]{2}\s+\d{5}\b/g,
  id: /\b(?:\d{3}[-\s]?\d{2}[-\s]?\d{4}|\b[A-Z]{2}\d{6}[A-Z]?\b)/g, // SSN and other ID formats
  financial: /\b(?:\$\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4})\b/g,
  health: /\b(?:Patient|Medical Record|Diagnosis|Treatment|Dr\.|prescription|condition:|MRN:)\s*[A-Za-z0-9\s\-]+\b/gi,
  other: /\b(?:confidential|classified|secret|private|internal use only)\b/gi,
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
    return [React.createElement('span', { key: "0" }, text)];
  }

  const result: JSX.Element[] = [];
  let lastIndex = 0;

  piiMatches.forEach((match, index) => {
    // Add text before the PII
    if (match.startIndex > lastIndex) {
      result.push(
        React.createElement(
          'span', 
          { key: `text-${index}` },
          text.substring(lastIndex, match.startIndex)
        )
      );
    }

    // Add the highlighted PII
    result.push(
      React.createElement(
        'mark',
        { 
          key: `pii-${index}`,
          className: `pii-highlight pii-${match.category}`,
          title: `PII Type: ${match.category}`
        },
        match.text
      )
    );

    lastIndex = match.endIndex;
  });

  // Add any remaining text after the last PII
  if (lastIndex < text.length) {
    result.push(
      React.createElement(
        'span',
        { key: 'text-last' },
        text.substring(lastIndex)
      )
    );
  }

  return result;
};
