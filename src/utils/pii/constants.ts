
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
    'Rahul', 'Priya', 'Amit', 'Neha', 'Raj', 'Ananya', 'Vikram', 'Meera',
    'Oliver', 'Sophia', 'Ethan', 'Isabella', 'Ava', 'Mia', 'Alexander', 'Charlotte',
    'Daniel', 'Amelia', 'Henry', 'Abigail', 'Joseph', 'Harper', 'Matthew', 'Evelyn'
  ],
  lastNames: [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Anderson', 'Wilson', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson',
    'Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Verma', 'Mehra', 'Joshi',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Perez', 'Young',
    'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Adams', 'Nelson', 'Hill', 'Ramirez'
  ],
  emailDomains: [
    'example.com', 'anonymous.org', 'private.net', 'redacted.com',
    'secure.net', 'protected.org', 'placeholder.com', 'masked.net',
    'mail.com', 'email.net', 'domain.org', 'hidden.com', 'confidential.net'
  ],
  streetNames: [
    'Maple Street', 'Oak Avenue', 'Cedar Lane', 'Pine Road', 'Elm Drive',
    'Birch Court', 'Willow Way', 'Spruce Boulevard', 'Aspen Circle', 'Sycamore Place',
    'MG Road', 'Nehru Street', 'Gandhi Marg', 'Subhash Nagar', 'Shivaji Lane',
    'Park Avenue', 'Main Street', 'First Avenue', 'Sunset Boulevard', 'Ocean Drive',
    'Hillside Road', 'Valley View', 'River Road', 'Forest Lane', 'Creek Drive'
  ],
  cities: [
    'Springfield', 'Riverside', 'Madison', 'Franklin', 'Clinton',
    'Georgetown', 'Arlington', 'Bristol', 'Salem', 'Newport',
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune',
    'Austin', 'Boston', 'Chicago', 'Denver', 'Seattle', 'Portland',
    'San Francisco', 'Los Angeles', 'San Diego', 'New York', 'Philadelphia'
  ],
  states: [
    'CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'MI', 'GA', 'NC',
    'MH', 'DL', 'KA', 'TN', 'WB', 'TS', 'HR', 'UP',
    'CO', 'WA', 'OR', 'MA', 'NJ', 'AZ', 'NV', 'UT', 'NM'
  ],
  hospitals: [
    'Central Hospital', 'Memorial Medical', 'Unity Healthcare', 'Providence Hospital',
    'St. Mary Medical Center', 'Regional Hospital', 'Community Health',
    'AIIMS', 'Apollo Hospital', 'Fortis Healthcare', 'Max Hospital',
    'General Hospital', 'City Medical Center', 'County Hospital', 'Mercy Hospital'
  ],
  conditions: [
    'General Checkup', 'Regular Visit', 'Health Screening', 'Annual Physical',
    'Routine Examination', 'Wellness Check', 'Medical Review',
    'Follow-up Appointment', 'Consultation', 'Physical Therapy',
    'Vaccination', 'Blood Test', 'X-Ray', 'MRI Scan', 'CT Scan'
  ],
  medications: [
    'Standard Medication', 'Common Treatment', 'Regular Prescription',
    'Basic Medicine', 'General Therapy', 'Routine Treatment',
    'Prescription Drug', 'Over-the-counter Medicine', 'Antibiotic', 'Pain Reliever'
  ],
  banks: [
    'State Bank', 'National Bank', 'City Union', 'Federal Bank', 'Reserve Bank',
    'HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Canara Bank',
    'Chase Bank', 'Bank of America', 'Wells Fargo', 'Citibank', 'TD Bank'
  ],
  indianIdTypes: ['Masked Aadhar', 'Masked PAN', 'Voter ID', 'Driving License', 'Passport'],
  creditCardNumbers: [
    '4111111111111111',  // Visa
    '5222222222222222',  // Mastercard
    '343333333333333',   // Amex
    '6011444444444444'   // Discover
  ],
  socialSecurityNumbers: [
    '000-00-0001', '000-00-0002', '000-00-0003', '000-00-0004',
    '000-00-0005', '000-00-0006', '000-00-0007', '000-00-0008',
    '000-00-0009', '000-00-0010'
  ],
  passportNumbers: [
    'P1234567', // US
    'UK12345678', // UK
    'CA123456789', // Canada
    'IND12345678', // India
    'US123456789',
    'UK98765432',
    'CA987654321',
    'IND98765432'
  ],
  driversLicenseNumbers: [
    'DL-CA12345678', // California
    'DL-NY98765432', // New York
    'DL-TX11223344', // Texas
    'DL-FL55667788', // Florida
    'DL-IL99887766'  // Illinois
  ],
  vehicleIdentificationNumbers: [
    '1ABC2DEF3GHJ4KL5M',
    '9XYZ8UVW7RST6PQ5N',
    '5JKL4MNP3QRST2UVW',
    '7GHI6JKL5MNOP4QRS',
    '3DEF2GHI1JKL0MNOP'
  ],
  ipAddresses: [
    '192.168.1.1', '192.168.1.2', '10.0.0.1', '10.0.0.2',
    '172.16.0.1', '172.16.0.2', '2001:db8::1', '2001:db8::2',
    '2001:db8:85a3::8a2e:370:7334', '2001:db8:85a3:8d3:1319:8a2e:370:7348'
  ],
  macAddresses: [
    '00:1A:2B:3C:4D:5E', '00:1B:2C:3D:4E:5F', '00:2A:3B:4C:5D:6E',
    '00:2B:3C:4D:5E:6F', '00:3A:4B:5C:6D:7E', '00:3B:4C:5D:6E:7F',
    'AA:BB:CC:DD:EE:FF', 'AA:CC:EE:11:33:55'
  ],
  patientRecordNumbers: [
    'PRN-12345', 'PRN-67890', 'PRN-13579', 'PRN-24680',
    'PRN-11223', 'PRN-44556', 'PRN-77889', 'PRN-00998',
    'PRN-11122', 'PRN-33445'
  ],
};

// Helper function to get random item from array
export const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};
