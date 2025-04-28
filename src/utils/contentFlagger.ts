
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
  // Original categories for PII detection
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
  ],
  
  // New categories for LLM prompt detection
  'Dangerous Content': [
    'bomb', 'weapon', 'explosive', 'kill', 'attack', 'violence', 'poison', 'harmful',
    'lethal', 'terrorist', 'terrorism', 'assassination', 'homicide', 'murder', 
    'suicide', 'torture', 'dangerous', 'destruction', 'destructive', 'damage',
    'threat', 'threatening', 'hazardous', 'weapon', 'ammunition', 'gun', 'firearm'
  ],
  'Unethical Instructions': [
    'bypass', 'ignore', 'circumvent', 'evade', 'avoid', 'break', 'hack', 'crack',
    'illegal', 'unethical', 'immoral', 'cheat', 'fraud', 'deceptive', 'manipulate',
    'manipulative', 'dishonest', 'scam', 'steal', 'theft', 'counterfeit', 'fake',
    'forge', 'falsify', 'lie', 'deceive', 'mislead', 'misrepresent', 
    'plagiarize', 'infringe', 'copyright', 'exploit', 'abuse'
  ],
  'Adversarial Prompting': [
    'DAN', 'do anything now', 'ignore previous instructions', 'disregard', 
    'forget your instructions', 'don\'t follow', 'break character',
    'new persona', 'new personality', 'new role', 'pretend to be',
    'roleplay as', 'simulation', 'hypothetical', 'jailbreak', 'prompt injection',
    'system prompt', 'instructions', 'override', 'ignore constraints',
    'bypass filters', 'ignore safety', 'ignore guidelines',
    'ignore ethical guidelines', 'ignore your programming'
  ],
  'Discrimination & Hate': [
    'racist', 'racism', 'sexist', 'sexism', 'homophobic', 'homophobia',
    'transphobic', 'transphobia', 'bigot', 'bigotry', 'supremacist', 'superiority',
    'inferior', 'hate', 'hateful', 'derogatory', 'slur', 'stereotype',
    'prejudice', 'discriminate', 'discrimination', 'xenophobic', 'xenophobia',
    'antisemitic', 'antisemitism', 'islamophobic', 'islamophobia'
  ],
  'NSFW Content': [
    'pornography', 'pornographic', 'explicit', 'sexual', 'obscene', 'nude',
    'naked', 'erotic', 'inappropriate', 'lewd', 'vulgar', 'fetish',
    'adult content', 'xxx', 'nsfw', 'not safe for work'
  ],
  'Data Scraping': [
    'scrape', 'crawler', 'spider', 'crawl', 'extract data', 'extract information',
    'harvest', 'harvesting', 'automate extraction', 'mass collection',
    'data mining', 'data collection', 'web scraping', 'scraper'
  ],
  'Prompt Engineering': [
    'write a prompt', 'create a prompt', 'craft a prompt', 'generate a prompt',
    'design a prompt', 'optimize a prompt', 'refine a prompt', 'improve a prompt',
    'prompt engineering', 'chain of thought', 'few shot', 'zero shot'
  ],
  'Safe Content': [
    'educational', 'learning', 'teach', 'study', 'academic', 'research',
    'scientific', 'informational', 'information', 'knowledge', 'explain',
    'summarize', 'translate', 'analyze', 'compare', 'discuss', 'describe',
    'report', 'factual', 'objective', 'ethical', 'appropriate', 'safe'
  ],
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
      
      // Calculate additional context-aware confidence for LLM-specific categories
      let additionalConfidence = 0;
      
      // Higher confidence for closely positioned matches (phrase detection)
      if (matches.length > 1) {
        // Check if matches appear close to each other (within 50 characters)
        const positions: number[] = [];
        matches.forEach(keyword => {
          let pos = lowercaseText.indexOf(keyword.toLowerCase());
          while (pos !== -1) {
            positions.push(pos);
            pos = lowercaseText.indexOf(keyword.toLowerCase(), pos + 1);
          }
        });
        
        positions.sort((a, b) => a - b);
        for (let i = 0; i < positions.length - 1; i++) {
          if (positions[i + 1] - positions[i] < 50) {
            additionalConfidence += 10;
            break;
          }
        }
      }
      
      // Special handling for LLM adversarial prompts - check for command-like structure
      if (category === 'Adversarial Prompting' && 
         (lowercaseText.includes('you must') || 
          lowercaseText.includes('you have to') ||
          lowercaseText.includes('you should') ||
          lowercaseText.includes('i want you to'))) {
        additionalConfidence += 15;
      }
      
      const confidence = Math.min(100, maxConfidence + 
                                 (totalOccurrences > matches.length ? 10 : 0) + 
                                 additionalConfidence);
      
      flags.push({
        category,
        confidence,
        description: `Contains ${category.toLowerCase()} related terms: ${matches.join(', ')}`,
      });
    }
  });
  
  // Add special check for common LLM jailbreak patterns and combinations
  const jailbreakPatterns = [
    "ignore previous instructions",
    "forget your training",
    "disregard your programming",
    "you are now",
    "from now on you are",
    "don't be concerned about",
    "don't worry about"
  ];
  
  const containsJailbreakPattern = jailbreakPatterns.some(pattern => 
    lowercaseText.includes(pattern.toLowerCase())
  );
  
  if (containsJailbreakPattern && !flags.some(flag => flag.category === 'Adversarial Prompting')) {
    flags.push({
      category: 'Adversarial Prompting',
      confidence: 85,
      description: 'Contains patterns typical of jailbreak attempts or instruction overrides',
    });
  }
  
  return {
    flags: flags.sort((a, b) => b.confidence - a.confidence),
    hasFlaggedContent: flags.length > 0 && flags.some(flag => flag.category !== 'Safe Content'),
  };
};
