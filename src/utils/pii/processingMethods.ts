import CryptoJS from 'crypto-js';
import { PiiCategory } from '../piiDetector';
import { syntheticData, getRandomItem } from './constants';

// Simple encryption using AES
export const encrypt = (text: string): string => {
  const salt = "PrivacyGuardian";
  return CryptoJS.AES.encrypt(text, salt).toString().substring(0, 20) + '...';
};

// Redaction methods for different types of PII
export const redactMethods: Record<PiiCategory, (text: string) => string> = {
  name: () => '[NAME REDACTED]',
  email: () => '[EMAIL REDACTED]',
  phone: () => '[PHONE REDACTED]',
  address: () => '[ADDRESS REDACTED]',
  id: () => '[ID REDACTED]',
  financial: () => '[FINANCIAL INFO REDACTED]',
  health: () => '[HEALTH INFO REDACTED]',
  other: () => '[REDACTED]',
  indian_id: () => '[INDIAN ID REDACTED]',
  indian_financial: () => '[INDIAN FINANCIAL INFO REDACTED]',
  credit_card: () => '[CREDIT CARD REDACTED]',
  ssn: () => '[SSN REDACTED]',
  passport: () => '[PASSPORT REDACTED]',
  drivers_license: () => '[DRIVERS LICENSE REDACTED]',
  vin: () => '[VIN REDACTED]',
  ip_address: () => '[IP ADDRESS REDACTED]',
  mac_address: () => '[MAC ADDRESS REDACTED]',
  patient_id: () => '[PATIENT ID REDACTED]',
};

// Anonymization methods for different types of PII
export const anonymizeMethods: Record<PiiCategory, (text: string) => string> = {
  name: () => {
    // Generate a random full name
    return `${getRandomItem(syntheticData.firstNames)} ${getRandomItem(syntheticData.lastNames)}`;
  },
  email: () => {
    // Generate a random email while keeping domain format
    const randomName = getRandomItem(syntheticData.firstNames).toLowerCase();
    const randomDomain = getRandomItem(syntheticData.emailDomains);
    return `${randomName}.${Math.floor(Math.random() * 1000)}@${randomDomain}`;
  },
  phone: () => {
    // Generate a random 10-digit Indian phone number starting with 6-9
    let phoneNumber = String(Math.floor(Math.random() * 4) + 6); // First digit: 6-9
    for (let i = 0; i < 9; i++) {
        phoneNumber += String(Math.floor(Math.random() * 10));
    }
  
    // Redact two random digits
    let redactedPhoneNumber = phoneNumber.split('');
    let indicesToRedact = [];
    while (indicesToRedact.length < 2) {
      const randomIndex = Math.floor(Math.random() * 10);
      if (!indicesToRedact.includes(randomIndex)) {
        indicesToRedact.push(randomIndex);
      }
    }
    indicesToRedact.forEach(index => {
      redactedPhoneNumber[index] = 'X';
    });
    return redactedPhoneNumber.join('');
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
  credit_card: () => '[CREDIT CARD REDACTED]',
  ssn: () => '[SSN REDACTED]',
  passport: () => '[PASSPORT REDACTED]',
  drivers_license: () => '[DRIVERS LICENSE REDACTED]',
  vin: () => '[VIN REDACTED]',
  ip_address: () => '[IP ADDRESS REDACTED]',
  mac_address: () => '[MAC ADDRESS REDACTED]',
  patient_id: () => '[PATIENT ID REDACTED]',
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
