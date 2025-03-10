export function countSyllables(text: string): number {
  if (!text) return 0;
  
  // Convert to lowercase
  text = text.toLowerCase();
  
  // Remove punctuation
  text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  
  // Spanish vowels
  const vowels = ['a', 'e', 'i', 'o', 'u', 'á', 'é', 'í', 'ó', 'ú', 'ü'];
  
  let syllableCount = 0;
  let inVowelGroup = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isVowel = vowels.includes(char);
    
    if (isVowel && !inVowelGroup) {
      syllableCount++;
      inVowelGroup = true;
    } else if (!isVowel) {
      inVowelGroup = false;
    }
    // If it's a vowel and we're already in a vowel group, we don't count it as a new syllable
  }
  
  return syllableCount;
}

// Function to count syllables in each word of a verse
export function countSyllablesInVerse(verse: string): number {
  if (!verse) return 0;
  
  // Replace multiple spaces with a single space and trim
  verse = verse.trim().replace(/\s+/g, ' ');
  
  // Spanish vowels
  const vowels = ['a', 'e', 'i', 'o', 'u', 'á', 'é', 'í', 'ó', 'ú', 'ü'];
  
  // Process the entire verse to handle vowels between words
  let syllableCount = 0;
  let inVowelGroup = false;
  
  for (let i = 0; i < verse.length; i++) {
    const char = verse[i];
    
    // Skip spaces but maintain vowel group state across words
    if (char === ' ') {
      // If the last character was a vowel, we need to check if the next non-space character is also a vowel
      // to handle cases like "mano al" where the 'o' and 'a' form a single syllable
      continue;
    }
    
    const isVowel = vowels.includes(char.toLowerCase());
    
    if (isVowel && !inVowelGroup) {
      syllableCount++;
      inVowelGroup = true;
    } else if (!isVowel) {
      inVowelGroup = false;
    }
  }
  
  return syllableCount;
} 