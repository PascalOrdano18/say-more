// This is a simplified rhyme finder for Spanish words
// In a real application, you would use a more comprehensive dictionary and algorithm

// Sample Spanish words dictionary with their endings for rhyming
const spanishWords: Record<string, string[]> = {
  // Words ending with 'ar'
  'ar': ['amar', 'cantar', 'bailar', 'hablar', 'mirar', 'pensar', 'soñar', 'llorar', 'jugar', 'andar'],
  
  // Words ending with 'er'
  'er': ['comer', 'beber', 'correr', 'leer', 'tener', 'hacer', 'ver', 'saber', 'querer', 'poder'],
  
  // Words ending with 'ir'
  'ir': ['vivir', 'sentir', 'partir', 'decir', 'escribir', 'reír', 'oír', 'dormir', 'salir', 'venir'],
  
  // Words ending with 'ado'
  'ado': ['amado', 'cantado', 'hablado', 'mirado', 'pensado', 'soñado', 'llorado', 'jugado', 'andado', 'estado'],
  
  // Words ending with 'ido'
  'ido': ['comido', 'bebido', 'corrido', 'leído', 'tenido', 'querido', 'podido', 'salido', 'venido', 'partido'],
  
  // Words ending with 'ante'
  'ante': ['amante', 'cantante', 'brillante', 'distante', 'gigante', 'instante', 'durante', 'mediante', 'semejante', 'importante'],
  
  // Words ending with 'ente'
  'ente': ['gente', 'mente', 'frente', 'fuente', 'puente', 'presente', 'ausente', 'diferente', 'siguiente', 'pendiente'],
  
  // Words ending with 'ón'
  'ón': ['corazón', 'canción', 'razón', 'pasión', 'emoción', 'acción', 'visión', 'misión', 'nación', 'ocasión'],
  
  // Words ending with 'or'
  'or': ['amor', 'dolor', 'color', 'valor', 'honor', 'favor', 'mejor', 'peor', 'mayor', 'menor'],
  
  // Words ending with 'ía'
  'ía': ['alegría', 'melodía', 'poesía', 'fantasía', 'energía', 'armonía', 'compañía', 'sabiduría', 'teoría', 'filosofía'],
};

// More endings can be added as needed

// Function to get the ending of a word for rhyming purposes
export function getWordEnding(word: string): string {
  if (!word || word.length < 2) return '';
  
  word = word.toLowerCase().trim();
  
  // For Spanish, we typically consider the last syllable for rhyming
  // This is a simplified approach
  if (word.length <= 3) {
    return word;
  }
  
  // Check for common endings
  const endings = ['ar', 'er', 'ir', 'ado', 'ido', 'ante', 'ente', 'ón', 'or', 'ía'];
  
  for (const ending of endings) {
    if (word.endsWith(ending)) {
      return ending;
    }
  }
  
  // Default to last 2 characters if no common ending found
  return word.slice(-2);
}

// Function to find rhyming words
export function findRhymingWords(word: string, limit: number = 5): string[] {
  if (!word) return [];
  
  const ending = getWordEnding(word);
  
  // Return words with the same ending
  return (spanishWords[ending] || []).filter(w => w !== word).slice(0, limit);
}

// Function to get suggested rhyming words for each rhyme pattern
export function getSuggestedRhymes(verses: string[], pattern: string): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  const patternMap: Record<string, number> = {};
  
  // Map each pattern letter to its first occurrence verse
  for (let i = 0; i < pattern.length; i++) {
    const letter = pattern[i].toLowerCase();
    if (!patternMap[letter] && i < verses.length && verses[i]) {
      patternMap[letter] = i;
    }
  }
  
  // For each uppercase letter in the pattern, find rhyming words
  for (let i = 0; i < pattern.length; i++) {
    const letter = pattern[i];
    const lowerLetter = letter.toLowerCase();
    
    // If it's an uppercase letter and we have a corresponding verse to rhyme with
    if (letter === letter.toUpperCase() && patternMap[lowerLetter] !== undefined) {
      const verseToRhymeWith = verses[patternMap[lowerLetter]];
      
      if (verseToRhymeWith) {
        // Get the last word of the verse
        const lastWord = verseToRhymeWith.split(' ').pop() || '';
        
        // Find rhyming words
        const rhymes = findRhymingWords(lastWord);
        
        // Store the suggestions
        if (!result[letter]) {
          result[letter] = rhymes;
        }
      }
    }
  }
  
  return result;
} 