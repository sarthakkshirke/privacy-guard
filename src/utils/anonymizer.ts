
import React from 'react';
import { PiiMatch, PiiCategory } from './piiDetector';

// Anonymization methods for different types of PII
const anonymizeMethods: Record<PiiCategory, (text: string) => string> = {
  name: (name) => {
    const parts = name.split(' ');
    return parts.map(part => part[0] + '***').join(' ');
  },
  email: (email) => {
    const [username, domain] = email.split('@');
    return `${username[0]}***@${domain}`;
  },
  phone: () => '***-***-****',
  address: () => '[ADDRESS REDACTED]',
  id: () => '[ID REDACTED]',
  financial: () => '[FINANCIAL INFO REDACTED]',
  health: () => '[HEALTH INFO REDACTED]',
  other: () => '[REDACTED]',
};

// Function to anonymize detected PII
export const anonymizePii = (text: string, piiMatches: PiiMatch[]): string => {
  if (piiMatches.length === 0) {
    return text;
  }

  // Sort matches in reverse order (to avoid index shifting when replacing text)
  const sortedMatches = [...piiMatches].sort((a, b) => b.startIndex - a.startIndex);
  
  let anonymizedText = text;
  
  // Replace each PII instance with its anonymized version
  sortedMatches.forEach(match => {
    const anonymizeMethod = anonymizeMethods[match.category];
    const anonymized = anonymizeMethod(match.text);
    
    anonymizedText = 
      anonymizedText.substring(0, match.startIndex) + 
      anonymized + 
      anonymizedText.substring(match.endIndex);
    
    // Update the match with the anonymized value for reference
    match.anonymized = anonymized;
  });
  
  return anonymizedText;
};

// Function to generate highlighted text with anonymized PII
export const generateAnonymizedHighlightedText = (text: string, piiMatches: PiiMatch[]): JSX.Element[] => {
  if (piiMatches.length === 0) {
    return [React.createElement('span', { key: "0" }, text)];
  }

  // Create a copy and sort by start index
  const sortedMatches = [...piiMatches].sort((a, b) => a.startIndex - b.startIndex);
  
  // First anonymize all PIIs
  sortedMatches.forEach(match => {
    const anonymizeMethod = anonymizeMethods[match.category];
    match.anonymized = anonymizeMethod(match.text);
  });

  const result: JSX.Element[] = [];
  let lastIndex = 0;

  sortedMatches.forEach((match, index) => {
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

    // Add the anonymized highlighted PII
    result.push(
      React.createElement(
        'mark',
        {
          key: `pii-${index}`,
          className: `pii-highlight pii-${match.category}`,
          title: `Original: ${match.text}\nType: ${match.category}`
        },
        match.anonymized
      )
    );

    lastIndex = match.endIndex;
  });

  // Add any remaining text after the last PII
  if (lastIndex < text.length) {
    result.push(
      React.createElement(
        'span',
        { key: `text-last` },
        text.substring(lastIndex)
      )
    );
  }

  return result;
};
