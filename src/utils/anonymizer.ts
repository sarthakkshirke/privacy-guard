import React from 'react';
import { PiiMatch, PiiCategory } from './piiDetector';

const syntheticData = {
  firstNames: ['John', 'Jane', 'Michael', 'Sarah', 'Robert', 'Emily', 'David', 'Lisa', 
               'James', 'Mary', 'William', 'Emma', 'Richard', 'Linda', 'Thomas', 'Susan',
               'Rahul', 'Priya', 'Amit', 'Neha', 'Raj', 'Ananya', 'Vikram', 'Meera'],
  lastNames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
              'Anderson', 'Wilson', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson',
              'Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Verma', 'Mehra', 'Joshi'],
  emailDomains: ['example.com', 'anonymous.org', 'private.net', 'redacted.com',
                 'secure.net', 'protected.org', 'placeholder.com', 'masked.net'],
  streetNames: ['Maple Street', 'Oak Avenue', 'Cedar Lane', 'Pine Road', 'Elm Drive',
                'Birch Court', 'Willow Way', 'Spruce Boulevard', 'Aspen Circle', 'Sycamore Place',
                'MG Road', 'Nehru Street', 'Gandhi Marg', 'Subhash Nagar', 'Shivaji Lane'],
  cities: ['Springfield', 'Riverside', 'Madison', 'Franklin', 'Clinton',
           'Georgetown', 'Arlington', 'Bristol', 'Salem', 'Newport',
           'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'],
  states: ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'MI', 'GA', 'NC',
           'MH', 'DL', 'KA', 'TN', 'WB', 'TS', 'HR', 'UP'],
  hospitals: ['Central Hospital', 'Memorial Medical', 'Unity Healthcare', 'Providence Hospital',
              'St. Mary Medical Center', 'Regional Hospital', 'Community Health',
              'AIIMS', 'Apollo Hospital', 'Fortis Healthcare', 'Max Hospital'],
  conditions: ['General Checkup', 'Regular Visit', 'Health Screening', 'Annual Physical',
               'Routine Examination', 'Wellness Check', 'Medical Review'],
  medications: ['Standard Medication', 'Common Treatment', 'Regular Prescription',
                'Basic Medicine', 'General Therapy', 'Routine Treatment'],
  banks: ['State Bank', 'National Bank', 'City Union', 'Federal Bank', 'Reserve Bank',
          'HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Canara Bank'],
  indianIdTypes: ['Masked Aadhar', 'Masked PAN', 'Voter ID', 'Driving License', 'Passport']
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
  health: (text: string) => {
    const hospital = getRandomItem(syntheticData.hospitals);
    const condition = getRandomItem(syntheticData.conditions);
    if (text.toLowerCase().includes('patient')) {
      return `Patient at ${hospital}`;
    } else if (text.toLowerCase().includes('diagnosis')) {
      return `Diagnosis: ${condition}`;
    } else {
      return `MRN-${Math.floor(Math.random() * 900000) + 100000}`;
    }
  },
  other: () => '[REDACTED]',
  
  // Adding the missing anonymization methods for Indian PII categories
  indian_id: (text: string) => {
    // Generate masked ID based on the pattern detected
    if (text.match(/[A-Z]{5}\d{4}[A-Z]/)) {
      // PAN Card format
      return `XXXXX${Math.floor(Math.random() * 9000) + 1000}X`;
    } else if (text.match(/\d{12}/)) {
      // Aadhar Card format
      return `XXXX-XXXX-${Math.floor(Math.random() * 9000) + 1000}`;
    } else {
      // Generic ID masking
      return getRandomItem(syntheticData.indianIdTypes);
    }
  },
  
  indian_financial: (text: string) => {
    // Generate masked financial info based on pattern
    if (text.match(/\d{11}/)) {
      // IFSC code format
      return `${getRandomItem(syntheticData.banks).substring(0, 4)}0${Math.floor(Math.random() * 900000) + 100000}`;
    } else if (text.match(/\d{2}[-\s]?\d{2}[-\s]?\d{6}[-\s]?\d/)) {
      // Bank account format
      return `XXXXXXXX${Math.floor(Math.random() * 9000) + 1000}`;
    } else {
      // UPI or other financial data
      return `XXXXX@${getRandomItem(syntheticData.banks).toLowerCase().replace(' ', '')}`;
    }
  }
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
