
import React from 'react';
import { PiiMatch, PiiCategory } from '../piiDetector';
import { PII_CATEGORIES } from './constants';
import { encrypt, redactMethods, anonymizeMethods } from './processingMethods';

// Helper function to process PII matches based on selected mode
const processPiiMatches = (
  piiMatches: PiiMatch[],
  selectedCategories: PiiCategory[] = Object.keys(PII_CATEGORIES) as PiiCategory[],
  mode: 'anonymize' | 'redact' | 'encrypt' = 'anonymize'
): PiiMatch[] => {
  // Create a copy of the matches
  const processedMatches = piiMatches
    .filter(match => selectedCategories.includes(match.category))
    .map(match => ({...match}));
    
  // Process each match
  processedMatches.forEach(match => {
    if (mode === 'redact') {
      match.anonymized = redactMethods[match.category](match.text);
    } else if (mode === 'encrypt') {
      match.anonymized = encrypt(match.text);
    } else {
      // Default: anonymize
      match.anonymized = anonymizeMethods[match.category](match.text);
    }
  });
  
  return processedMatches;
};

// Function to encrypt detected PII
export const encryptPii = (text: string, piiMatches: PiiMatch[], selectedCategories: PiiCategory[]): string => {
  if (piiMatches.length === 0) {
    return text;
  }

  // Process matches using the common function with encrypt mode
  const processedMatches = processPiiMatches(piiMatches, selectedCategories, 'encrypt')
    .sort((a, b) => b.startIndex - a.startIndex); // Sort in reverse order for replacement
  
  let encryptedText = text;
  
  // Replace each PII instance with its encrypted version
  processedMatches.forEach(match => {
    const encrypted = match.anonymized || encrypt(match.text);
    
    encryptedText = 
      encryptedText.substring(0, match.startIndex) + 
      encrypted + 
      encryptedText.substring(match.endIndex);
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

  // Process matches using the common function
  const processedMatches = processPiiMatches(piiMatches, selectedCategories, mode)
    .sort((a, b) => b.startIndex - a.startIndex); // Sort in reverse order for replacement
  
  let anonymizedText = text;
  
  // Replace each PII instance with its processed version
  processedMatches.forEach(match => {
    const processed = match.anonymized || match.text;
    
    anonymizedText = 
      anonymizedText.substring(0, match.startIndex) + 
      processed + 
      anonymizedText.substring(match.endIndex);
  });
  
  return anonymizedText;
};
