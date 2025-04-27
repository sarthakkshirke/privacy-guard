
import { PiiResult } from './piiDetector';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface RiskFactor {
  name: string;
  score: number;
  description: string;
}

export interface RiskScore {
  score: number; // 0-100
  level: RiskLevel;
  factors: RiskFactor[];
}

// PII category weights (how sensitive each type is)
const PII_WEIGHTS = {
  name: 5,
  email: 10,
  phone: 10,
  address: 15,
  id: 25,
  financial: 30,
  health: 35,
  other: 5,
};

// Risk categories
const CONTEXT_CATEGORIES = [
  'political',
  'organizational',
  'personal',
  'financial',
  'health',
  'legal',
];

// Simplified context detection with basic keywords
const detectContextRisk = (text: string): RiskFactor[] => {
  const lowercaseText = text.toLowerCase();
  const contextFactors: RiskFactor[] = [];
  
  // Simple keyword detection for various contexts
  const keywords = {
    political: ['government', 'election', 'policy', 'party', 'president', 'vote'],
    organizational: ['confidential', 'internal', 'company', 'corporate', 'proprietary'],
    financial: ['bank', 'account', 'credit', 'money', 'transaction', 'payment'],
    health: ['health', 'medical', 'doctor', 'patient', 'diagnosis', 'treatment'],
    legal: ['legal', 'lawsuit', 'attorney', 'court', 'judge', 'contract'],
  };
  
  // Check for keywords in each category
  Object.entries(keywords).forEach(([category, words]) => {
    const found = words.some(word => lowercaseText.includes(word));
    if (found) {
      contextFactors.push({
        name: `${category.charAt(0).toUpperCase() + category.slice(1)} Context`,
        score: 10, // Basic score for each context type found
        description: `Text contains ${category} context which increases risk.`,
      });
    }
  });
  
  return contextFactors;
};

// Calculate risk score based on PII data and text context
export const calculateRiskScore = (text: string, piiResult: PiiResult): RiskScore => {
  const { piiCount, totalPiiCount } = piiResult;
  const factors: RiskFactor[] = [];
  let baseScore = 0;
  
  // Factor 1: PII density - how many PIIs per text length
  const textLength = text.length;
  const piiDensity = textLength > 0 ? (totalPiiCount / textLength) * 1000 : 0;
  factors.push({
    name: 'PII Density',
    score: Math.min(25, Math.round(piiDensity * 25)),
    description: `Text contains ${totalPiiCount} PII instances in ${textLength} characters.`,
  });
  
  // Factor 2: PII sensitivity - weighted by type
  let sensitivityScore = 0;
  Object.entries(piiCount).forEach(([category, count]) => {
    const categoryWeight = PII_WEIGHTS[category as keyof typeof PII_WEIGHTS] || 5;
    sensitivityScore += count * categoryWeight;
    
    if (count > 0) {
      factors.push({
        name: `Contains ${category}`,
        score: categoryWeight * count,
        description: `Found ${count} instances of ${category} PII.`,
      });
    }
  });
  
  // Normalize sensitivity score to 0-40 range
  sensitivityScore = Math.min(40, sensitivityScore);
  baseScore += sensitivityScore;
  
  // Factor 3: Context risk - based on content topics
  const contextFactors = detectContextRisk(text);
  const contextScore = contextFactors.reduce((sum, factor) => sum + factor.score, 0);
  
  // Add context factors to overall factors list
  factors.push(...contextFactors);
  
  // Cap context score at 35
  const normalizedContextScore = Math.min(35, contextScore);
  baseScore += normalizedContextScore;
  
  // Final score is sum of all factors, capped at 100
  const finalScore = Math.min(100, baseScore);
  
  // Determine risk level based on final score
  let riskLevel: RiskLevel;
  if (finalScore < 25) {
    riskLevel = 'low';
  } else if (finalScore < 50) {
    riskLevel = 'medium';
  } else if (finalScore < 75) {
    riskLevel = 'high';
  } else {
    riskLevel = 'critical';
  }
  
  return {
    score: finalScore,
    level: riskLevel,
    factors,
  };
};
