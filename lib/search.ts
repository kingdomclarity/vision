// Utility function to calculate string similarity (Levenshtein distance)
export function getLevenshteinDistance(str1: string, str2: string): number {
  const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null));
  for (let i = 0; i <= str1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= str2.length; j += 1) track[j][0] = j;
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1].toLowerCase() === str2[j - 1].toLowerCase() ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  return track[str2.length][str1.length];
}

// Get individual words from a string
export function getWords(str: string): string[] {
  return str.toLowerCase().split(/\s+/).filter(Boolean);
}

// Check if two strings are similar enough to be considered a match
export function areSimilarStrings(str1: string, str2: string): boolean {
  const words1 = getWords(str1);
  const words2 = getWords(str2);

  // Check each word pair for similarity
  for (const word1 of words1) {
    for (const word2 of words2) {
      const distance = getLevenshteinDistance(word1, word2);
      const maxLength = Math.max(word1.length, word2.length);
      // More lenient threshold for shorter words
      const threshold = maxLength <= 4 ? 1 : 2;
      if (distance <= threshold) {
        return true;
      }
    }
  }

  return false;
}