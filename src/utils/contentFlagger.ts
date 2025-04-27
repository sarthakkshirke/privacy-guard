
export interface Flag {
  category: string;
  confidence: number;
  description: string;
}

export interface FlaggingResult {
  flags: Flag[];
  hasFlaggedContent: boolean;
}

// Function to check for potentially concerning content
// In a real app, this would use an AI model or more sophisticated detection
export const flagContent = (text: string): FlaggingResult => {
  const lowercaseText = text.toLowerCase();
  const flags: Flag[] = [];
  
  // Simple keyword-based approach for flagging
  const categories = {
    'Unethical Content': [
      'hack', 'steal', 'illegal', 'cheat', 'fraud', 'scam'
    ],
    'Dangerous Content': [
      'weapon', 'bomb', 'kill', 'attack', 'explosive', 'violence'
    ],
    'Adversarial Prompt': [
      'ignore previous instructions', 'disregard', 'system prompt', 'override'
    ],
    'Political Content': [
      'election', 'party', 'campaign', 'vote', 'political', 'government'
    ],
    'Potentially Confidential': [
      'confidential', 'secret', 'private', 'internal', 'proprietary', 'restricted'
    ],
  };
  
  // Check each category
  Object.entries(categories).forEach(([category, keywords]) => {
    const matches = keywords.filter(keyword => lowercaseText.includes(keyword));
    
    if (matches.length > 0) {
      const confidence = Math.min(100, matches.length * 25);
      flags.push({
        category,
        confidence,
        description: `Contains potentially ${category.toLowerCase()} keywords: ${matches.join(', ')}`,
      });
    }
  });
  
  return {
    flags,
    hasFlaggedContent: flags.length > 0,
  };
};
