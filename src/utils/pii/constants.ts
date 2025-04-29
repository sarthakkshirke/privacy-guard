
import { PiiCategory } from '../piiDetector';

// Define an object to store PII category values
export const PII_CATEGORIES = {
  name: 'name',
  email: 'email',
  phone: 'phone',
  address: 'address',
  id: 'id',
  financial: 'financial',
  health: 'health',
  other: 'other',
  indian_id: 'indian_id',
  indian_financial: 'indian_financial'
} as const;

// Synthetic data for anonymization
export const syntheticData = {
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
export const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};
