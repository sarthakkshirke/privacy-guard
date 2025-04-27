
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
    'password', 'credentials', 'login', 'authentication', 'access key', 'token'
  ],
  'Confidential': [
    'confidential', 'secret', 'private', 'internal', 'proprietary', 'restricted',
    'classified', 'sensitive', 'nda', 'agreement'
  ],
  'Financial Risk': [
    'bank', 'account', 'credit', 'balance', 'transaction', 'payment',
    'invoice', 'salary', 'income', 'revenue'
  ],
  'Medical Risk': [
    'diagnosis', 'treatment', 'patient', 'medical', 'prescription', 'health',
    'condition', 'hospital', 'doctor', 'medication'
  ],
  'Personal Risk': [
    'ssn', 'social security', 'passport', 'driver license', 'birth date',
    'address', 'phone', 'email'
  ],
  'Political Risk': [
    'election', 'party', 'campaign', 'government', 'political', 'policy',
    'classified', 'clearance', 'authorization'
  ],
  'Corporate Risk': [
    'merger', 'acquisition', 'strategy', 'restructuring', 'layoff',
    'intellectual property', 'trade secret', 'patent'
  ]
};

export const flagContent = (text: string): FlaggingResult => {
  const lowercaseText = text.toLowerCase();
  const flags: Flag[] = [];
  
  Object.entries(categories).forEach(([category, keywords]) => {
    const matches = keywords.filter(keyword => lowercaseText.includes(keyword));
    
    if (matches.length > 0) {
      const confidence = Math.min(100, matches.length * 20);
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
