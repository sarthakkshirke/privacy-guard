
import React from 'react';
import { PiiMatch, PiiCategory } from '../piiDetector';
import { PII_CATEGORIES } from './constants';
import { redactMethods, encrypt, anonymizeMethods } from './processingMethods';

// Function to generate highlighted text with anonymized PII
export const generateAnonymizedHighlightedText = (
  text: string, 
  piiMatches: PiiMatch[],
  selectedCategories: PiiCategory[] = Object.keys(PII_CATEGORIES) as PiiCategory[],
  mode: 'anonymize' | 'redact' | 'encrypt' = 'anonymize'
): JSX.Element[] => {
  if (piiMatches.length === 0) {
    return [React.createElement('span', { key: "0" }, text)];
  }

  // Create a copy and sort by start index
  const sortedMatches = [...piiMatches]
    .filter(match => selectedCategories.includes(match.category))
    .sort((a, b) => a.startIndex - b.startIndex);
  
  // First process all PIIs based on selected mode - this ensures consistency with anonymizePii
  sortedMatches.forEach(match => {
    if (mode === 'redact') {
      match.anonymized = redactMethods[match.category](match.text);
    } else if (mode === 'encrypt') {
      match.anonymized = encrypt(match.text);
    } else {
      // Default: anonymize
      match.anonymized = anonymizeMethods[match.category](match.text);
    }
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
        match.anonymized || match.text
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
