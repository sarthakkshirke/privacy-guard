import React from 'react';
import { PiiMatch, PiiCategory } from './piiDetector';

// Synthetic data for generating fake but realistic-looking replacements
const syntheticData = {
  firstNames: ['John', 'Jane', 'Michael', 'Sarah', 'Robert', 'Emily', 'David', 'Lisa'],
  lastNames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'],
  emailDomains: ['example.com', 'anonymous.org', 'private.net', 'redacted.com'],
  streetNames: ['Maple Street', 'Oak Avenue', 'Cedar Lane', 'Pine Road', 'Elm Drive'],
  cities: ['Springfield', 'Riverside', 'Madison', 'Franklin', 'Clinton'],
  states: ['CA', 'NY', 'TX', 'FL', 'IL'],
};

// Helper function to get random item from array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Anonymization methods for different types of PII
const anonymizeMethods: Record<PiiCategory, (text: string) => string> = {
  name: (name) => {
    // Generate a random full name
    return `${getRandomItem(syntheticData.firstNames)} ${getRandomItem(syntheticData.lastNames)}`;
  },
  email: (email) => {
    // Generate a random email while keeping domain format
    const randomName = getRandomItem(syntheticData.firstNames).toLowerCase();
    const randomDomain = getRandomItem(syntheticData.emailDomains);
    return `${randomName}.${Math.floor(Math.random() * 1000)}@${randomDomain}`;
  },
  phone: () => {
    // Generate a random US phone number
    const areaCode = Math.floor(Math.random() * 900) + 100;
    const prefix = Math.floor(Math.random() * 900) + 100;
    const lineNum = Math.floor(Math.random() * 9000) + 1000;
    return `${areaCode}-${prefix}-${lineNum}`;
  },
  address: () => {
    // Generate a random US address
    const houseNumber = Math.floor(Math.random() * 9000) + 1000;
    const street = getRandomItem(syntheticData.streetNames);
    const city = getRandomItem(syntheticData.cities);
    const state = getRandomItem(syntheticData.states);
    const zip = Math.floor(Math.random() * 90000) + 10000;
    return `${houseNumber} ${street}, ${city}, ${state} ${zip}`;
  },
  id: () => {
    // Generate a random ID that looks like a masked SSN
    return `XXX-XX-${Math.floor(Math.random() * 9000) + 1000}`;
  },
  financial: () => {
    // Generate a random credit card number format
    return `XXXX-XXXX-XXXX-${Math.floor(Math.random() * 9000) + 1000}`;
  },
  health: () => {
    // Generate a random medical record number
    return `MRN-${Math.floor(Math.random() * 900000) + 100000}`;
  },
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
