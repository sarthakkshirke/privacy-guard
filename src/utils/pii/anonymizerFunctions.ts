
import React from 'react';
import { PiiMatch, PiiCategory } from '../piiDetector';
import { PII_CATEGORIES } from './constants';
import { encrypt, redactMethods, anonymizeMethods } from './processingMethods';

// Function to encrypt detected PII
export const encryptPii = (text: string, piiMatches: PiiMatch[], selectedCategories: PiiCategory[]): string => {
  if (piiMatches.length === 0) {
    return text;
  }

  // Sort matches in reverse order (to avoid index shifting when replacing text)
  const sortedMatches = [...piiMatches]
    .filter(match => selectedCategories.includes(match.category))
    .sort((a, b) => b.startIndex - a.startIndex);
  
  let encryptedText = text;
  
  // Replace each PII instance with its encrypted version
  sortedMatches.forEach(match => {
    const encrypted = encrypt(match.text);
    
    encryptedText = 
      encryptedText.substring(0, match.startIndex) + 
      encrypted + 
      encryptedText.substring(match.endIndex);
    
    // Update the match with the encrypted value for reference
    match.anonymized = encrypted;
  });
  
  return encryptedText;
};

// Function to anonymize detected PII
export const anonymizePii = (
  text: string, 
  piiMatches: PiiMatch[], 
  selectedCategories: PiiCategory[] = Object.keys(PII_CATEGORIES) as PiiCategory[], 
  mode: 'anonymize' | 'redact' | 'encrypt' = 'anonymize'
): string => {
  if (piiMatches.length === 0) {
    return text;
  }

  // Sort matches in reverse order (to avoid index shifting when replacing text)
  const sortedMatches = [...piiMatches]
    .filter(match => selectedCategories.includes(match.category))
    .sort((a, b) => b.startIndex - a.startIndex);
  
  let anonymizedText = text;
  
  // Replace each PII instance with its processed version
  sortedMatches.forEach(match => {
    let processed = match.text;
    
    if (mode === 'redact') {
      processed = redactMethods[match.category](match.text);
    } else if (mode === 'encrypt') {
      processed = encrypt(match.text);
    } else {
      // Default: anonymize
      processed = anonymizeMethods[match.category](match.text);
    }
    
    anonymizedText = 
      anonymizedText.substring(0, match.startIndex) + 
      processed + 
      anonymizedText.substring(match.endIndex);
    
    // Update the match with the processed value for reference
    match.anonymized = processed;
  });
  
  return anonymizedText;
};
