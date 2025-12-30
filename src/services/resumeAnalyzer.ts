import type { ResumeAnalysis } from '../types';

/**
 * Extract keywords from job description
 */
export const extractKeywords = (text: string): string[] => {
  // Common technical and professional keywords
  const commonKeywords = [
    'react', 'javascript', 'typescript', 'node', 'python', 'java', 'sql',
    'aws', 'azure', 'docker', 'kubernetes', 'git', 'agile', 'scrum',
    'api', 'rest', 'graphql', 'mongodb', 'postgresql', 'redis',
    'ci/cd', 'testing', 'jest', 'cypress', 'leadership', 'communication',
    'problem-solving', 'team', 'project management', 'frontend', 'backend',
    'full-stack', 'ui/ux', 'responsive', 'mobile', 'web', 'cloud',
    'machine learning', 'ai', 'data', 'analytics', 'security'
  ];

  const lowerText = text.toLowerCase();
  
  // Extract keywords that appear in common keywords or are significant
  const extractedKeywords = new Set<string>();
  
  commonKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      extractedKeywords.add(keyword);
    }
  });

  // Extract capitalized words (likely important terms)
  const capitalizedWords = text.match(/\b[A-Z][a-zA-Z0-9+#.]+\b/g) || [];
  capitalizedWords.forEach(word => {
    if (word.length > 2) {
      extractedKeywords.add(word.toLowerCase());
    }
  });

  // Extract multi-word phrases (e.g., "machine learning", "project management")
  const phrases = text.match(/\b(?:[A-Z][a-z]+\s){1,2}[A-Z][a-z]+\b/g) || [];
  phrases.forEach(phrase => {
    extractedKeywords.add(phrase.toLowerCase());
  });

  return Array.from(extractedKeywords).slice(0, 50); // Limit to 50 keywords
};

/**
 * Analyze resume against job description
 */
export const analyzeResume = (
  resumeText: string,
  jobDescription: string
): ResumeAnalysis => {
  const jdKeywords = extractKeywords(jobDescription);
  const resumeLower = resumeText.toLowerCase();

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  jdKeywords.forEach(keyword => {
    if (resumeLower.includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  const matchPercentage = jdKeywords.length > 0
    ? Math.round((matchedKeywords.length / jdKeywords.length) * 100)
    : 0;

  const suggestions = generateSuggestions(matchPercentage, missingKeywords);

  return {
    matchPercentage,
    matchedKeywords,
    missingKeywords,
    suggestions,
  };
};

/**
 * Generate improvement suggestions based on analysis
 */
const generateSuggestions = (
  matchPercentage: number,
  missingKeywords: string[]
): string[] => {
  const suggestions: string[] = [];

  if (matchPercentage < 30) {
    suggestions.push('Your resume has very low keyword match. Consider tailoring it more closely to the job description.');
  } else if (matchPercentage < 50) {
    suggestions.push('Your resume has moderate keyword match. Try incorporating more relevant skills and technologies.');
  } else if (matchPercentage < 70) {
    suggestions.push('Good keyword match! Add a few more specific skills to improve further.');
  } else {
    suggestions.push('Excellent keyword match! Your resume aligns well with the job description.');
  }

  if (missingKeywords.length > 0) {
    const topMissing = missingKeywords.slice(0, 5);
    suggestions.push(`Consider adding these keywords: ${topMissing.join(', ')}`);
  }

  suggestions.push('Quantify your achievements with numbers and metrics where possible.');
  suggestions.push('Use action verbs at the start of each bullet point.');
  suggestions.push('Ensure your resume is ATS-friendly with clear formatting.');

  return suggestions;
};

/**
 * Extract text from uploaded file
 */
export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};
