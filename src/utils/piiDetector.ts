// PII categories and regular expressions for detection
import React from 'react';

export type PiiCategory = 'name' | 'email' | 'phone' | 'address' | 'id' | 'financial' | 'health' | 'other' | 'indian_id' | 'indian_financial' | 'credit_card' | 'ssn' | 'passport' | 'drivers_license' | 'vin' | 'ip_address' | 'mac_address' | 'patient_id';

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

// Comprehensive PII detection patterns with enhanced accuracy and broader coverage
const piiRegexes = {
  // Names: Detects first and last names.
  name: /\b([A-Z][a-z]+)\s+([A-Z][a-z]+)\b/g,

  // Emails: Detects standard email formats.
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,

    // Phone Numbers: Detects Indian phone numbers and generic 10-digit numbers with more precision.
  phone: /(?<!\d)(?:\+91[\s-]?)?[6-9]\d{9}(?!\d)|(?<!\d)\b\d{10}\b(?!\d)/g,

  // Addresses: Detects Indian addresses with PIN codes and more generic address patterns.
  address: /\b\d+\s+[A-Za-z\s]+(?:,\s*[A-Za-z\s]+){1,2},\s*[A-Z]{2}\s+\d{6}\b|\b\d+\s+[\w\s.,-]+(?:,\s*[\w\s.,-]+){1,2}\b/gi,

  // US Social Security Numbers: Detects SSN in the format XXX-XX-XXXX.
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,

  // US Drivers License: Detects US driver license numbers.
  driversLicenseUS: /\b[A-Z]\d{8,14}\b/gi,
  
  // Passport Numbers: Detects US, UK, Canadian, and Indian passport numbers.
  passportNumber: /\b(?:[A-Z]{2}\d{7}|[A-Z]{2}\d{6}|[A-PR-WYa-pr-wy][0-9]{6,9})\b/gi, // common formats
  
  //Vehicle Identification Numbers (VINs): Detects VINs, 17 characters, digits and uppercase letters.
  vinNumber: /\b[A-HJ-NPR-Za-hj-npr-z\d]{8}[\dX][A-HJ-NPR-Za-hj-npr-z\d]{2}\d{6}\b/g,
  
  // Credit Card Numbers (Visa, Mastercard, Amex, Discover): Detects common credit card patterns.
  creditCard: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,
  
  // IP Addresses (IPv4 and IPv6): Detects IPv4 and IPv6 addresses.
  ipAddress: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b|\b(?:(?:[0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(?:(?::[0-9a-fA-F]{1,4}){1,6})|:(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(?:ffff(?::0{1,4}){0,1}:){0,1}(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])|(?:[0-9a-fA-F]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\b/gi,
  
  // MAC Addresses: Detects MAC addresses in common formats.
  macAddress: /\b([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})\b/g,

  // Generic ID Numbers: Catches common ID number patterns
  id: /(?<!\d)\b\d{8,14}\b(?!\d)|(?<!\d)(?:\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b)(?!\d)/g,

  // Financial: Detects currency amounts and common bank account patterns, refined for accuracy.
  financial: /(?<!\d)\b\d{9,18}\b(?!\d)|\b(?:\$\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?)|(?<!\d)(?:\d{4}[-\s]?){3}\d{4}(?!\d)/g,
  
  // Patient Record Numbers: Detects patient medical record numbers.
  patientRecord: /\b(?:MRN|Patient ID|Record #):\s*[A-Za-z0-9-]+\b/gi,
  
  // Health: Enhanced keywords for health-related information.
  health: /\b(?:Patient|Medical Record|Diagnosis|Treatment|Dr\.|prescription|condition:|MRN:|medication|healthcare|hospital|medical history|allergies)\s*[A-Za-z0-9\s-]+\b/gi,

  // Indian Identifiers (Aadhar, PAN, Passport, Voter ID, Driving License).
  indian_id: /\b(?:(?:[A-Z]{5}\d{4}[A-Z]|[A-Z]{2}\d{7})|(?:\d{12})|(?:[A-Z]{2}\d{6}[A-Z])|(?:[A-Z]{4}\d{7})|(?:[A-Z]{3}\d{7}))\b/gi,
  
  // Indian Financial Identifiers (IFSC, Bank Account, UPI ID).
  indian_financial: /\b(?:(?:\d{11})|(?:\d{2}[-\s]?\d{2}[-\s]?\d{6}[-\s]?\d)|(?:\d{4}[-\s]?\d{4}[-\s]?\d{4}))\b/g, // IFSC, Bank Account, UPI ID

  // Confidential Information: Detects keywords related to confidential data.
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
    indian_id: 0,
    indian_financial: 0,
    credit_card: 0,
    ssn: 0,
    passport: 0,
    drivers_license: 0,
    vin: 0,
    ip_address: 0,
    mac_address: 0,
    patient_id: 0
  };

  const allMatches: PiiMatch[] = [];

  Object.entries(piiRegexes).forEach(([category, pattern]) => {
    const matches = [...text.matchAll(new RegExp(pattern, 'g'))];

    matches.forEach((match) => {
      const matchText = match[0];
      const startIndex = match.index || 0;
      const endIndex = startIndex + matchText.length;      

      allMatches.push({
        text: matchText,
        startIndex,
        endIndex,
        category: category as PiiCategory,
      });
    });
  });

  allMatches.sort((a, b) => a.startIndex - b.startIndex);

  const consolidatedMatches: PiiMatch[] = [];
  let lastEnd = -1;

  allMatches.forEach(match => {
    if (match.startIndex > lastEnd) {
      consolidatedMatches.push(match);
      lastEnd = match.endIndex;
    } else if (match.endIndex > lastEnd){
        const lastMatch = consolidatedMatches.pop();
        if(lastMatch){
            const newMatch = {...lastMatch, endIndex: match.endIndex, text: text.substring(lastMatch.startIndex, match.endIndex)}
            consolidatedMatches.push(newMatch);
            lastEnd = match.endIndex;
        }
    }
  });

  consolidatedMatches.forEach(match => {
    piiCount[match.category] +=1;
  })

  // Sort detected PII by start index to maintain original text order
  detectedPii.sort((a, b) => a.startIndex - b.startIndex);
  
  // Calculate total PII count
  const totalPiiCount = Object.values(piiCount).reduce((a, b) => a + b, 0);

    return {
    detectedPii: consolidatedMatches,
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
