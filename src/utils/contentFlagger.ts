
export interface Flag {
  category: string;
  confidence: number;
  description: string;
}

export interface FlaggingResult {
  flags: Flag[];
  hasFlaggedContent: boolean;
}

const categories = {
  'Security Risk': [
    'password', 'credentials', 'login', 'authentication', 'access key', 'token',
    'authorized', 'authorization', 'secure', 'security', 'clearance'
  ],
  'Confidential': [
    'confidential', 'secret', 'private', 'internal', 'proprietary', 'restricted',
    'classified', 'sensitive', 'nda', 'agreement', 'do not distribute',
    'authorized personnel', 'internal use only'
  ],
  'Financial Risk': [
    'bank', 'account', 'credit', 'balance', 'transaction', 'payment',
    'invoice', 'salary', 'income', 'revenue', 'routing', 'financial',
    'money', 'fund', '$', 'dollar', 'euro', '€', '£', 'pound'
  ],
  'Medical Risk': [
    'diagnosis', 'treatment', 'patient', 'medical', 'prescription', 'health',
    'condition', 'hospital', 'doctor', 'medication', 'medical record', 'chronic',
    'symptoms', 'disease', 'illness', 'healthcare', 'clinic', 'therapy'
  ],
  'Personal Risk': [
    'ssn', 'social security', 'passport', 'driver license', 'birth date',
    'address', 'phone', 'email', 'contact', 'full name', 'date of birth',
    'id', 'identification', 'zip code', 'postal code'
  ],
  'Political Risk': [
    'election', 'party', 'campaign', 'government', 'political', 'policy',
    'classified', 'clearance', 'authorization', 'intelligence', 'official'
  ],
  'Corporate Risk': [
    'merger', 'acquisition', 'strategy', 'restructuring', 'layoff',
    'intellectual property', 'trade secret', 'patent', 'company',
    'business', 'enterprise'
  ]
};

export const flagContent = (text: string): FlaggingResult => {
  const lowercaseText = text.toLowerCase();
  const flags: Flag[] = [];
  
  Object.entries(categories).forEach(([category, keywords]) => {
    const matches = keywords.filter(keyword => lowercaseText.includes(keyword.toLowerCase()));
    
    if (matches.length > 0) {
      // Calculate confidence based on number of matches and their prominence
      const matchCount = matches.length;
      const maxConfidence = Math.min(100, matchCount * 15 + 10);
      
      // Check for multiple occurrences of each keyword to boost confidence
      let totalOccurrences = 0;
      matches.forEach(keyword => {
        const regex = new RegExp(keyword.toLowerCase(), 'g');
        const occurrences = (lowercaseText.match(regex) || []).length;
        totalOccurrences += occurrences;
      });
      
      const confidence = Math.min(100, maxConfidence + (totalOccurrences > matches.length ? 10 : 0));
      
      flags.push({
        category,
        confidence,
        description: `Contains ${category.toLowerCase()} related terms: ${matches.join(', ')}`,
      });
    }
  });
  
  return {
    flags: flags.sort((a, b) => b.confidence - a.confidence),
    hasFlaggedContent: flags.length > 0,
  };
};
