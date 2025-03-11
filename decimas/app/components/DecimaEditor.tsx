'use client';

import { useState, useEffect } from 'react';
import { countSyllablesInVerse } from '../utils/syllableCounter';
import { getSuggestedRhymes, findRhymingWords } from '../utils/rhymeHelper';
import { saveDecima, updateDecima } from '../utils/storage';
import DecimaGraph from './DecimaGraph';
import { useRouter } from 'next/navigation';

const DECIMA_PATTERN = 'ABBAACCDDC';
const TARGET_SYLLABLES = 8;

interface DecimaEditorProps {
  editId?: string;
  initialTitle?: string;
  initialVerses?: string[];
}

export default function DecimaEditor({ editId, initialTitle = '', initialVerses = Array(10).fill('') }: DecimaEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState<string>(initialTitle);
  const [verses, setVerses] = useState<string[]>(initialVerses);
  const [syllableCounts, setSyllableCounts] = useState<number[]>(Array(10).fill(0));
  const [rhymeSuggestions, setRhymeSuggestions] = useState<Record<string, string[]>>({});
  const [activeVerseIndex, setActiveVerseIndex] = useState<number>(0);
  const [lastWordSuggestions, setLastWordSuggestions] = useState<string[]>([]);
  const [saveMessage, setSaveMessage] = useState<string>('');

  // Update syllable count when verses change
  useEffect(() => {
    const counts = verses.map(verse => countSyllablesInVerse(verse));
    setSyllableCounts(counts);
    
    // Update rhyme suggestions
    const suggestions = getSuggestedRhymes(verses, DECIMA_PATTERN);
    setRhymeSuggestions(suggestions);
    
    // Update last word suggestions for active verse
    updateLastWordSuggestions(activeVerseIndex);
  }, [verses, activeVerseIndex]);

  // Clear save message after 3 seconds
  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => {
        setSaveMessage('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  // Handle verse change
  const handleVerseChange = (index: number, value: string) => {
    const newVerses = [...verses];
    newVerses[index] = value;
    setVerses(newVerses);
  };

  // Handle title change
  const handleTitleChange = (value: string) => {
    setTitle(value);
  };

  // Handle save
  const handleSave = () => {
    // Filter out empty verses
    const nonEmptyVerses = verses.filter(verse => verse.trim() !== '');
    
    // Check if we have at least one verse
    if (nonEmptyVerses.length === 0) {
      setSaveMessage('Por favor, escribe al menos un verso antes de guardar.');
      return;
    }
    
    // Save or update the decima
    if (editId) {
      updateDecima(editId, title, verses);
      setSaveMessage('¡Décima actualizada con éxito!');
    } else {
      saveDecima(title, verses);
      setSaveMessage('¡Décima guardada con éxito!');
    }
  };

  // Navigate to saved decimas
  const handleViewSaved = () => {
    router.push('/saved');
  };

  // Get color class based on syllable count
  const getSyllableCountClass = (count: number) => {
    if (count === 0) return 'text-gray-400';
    if (count === TARGET_SYLLABLES) return 'text-green-600 font-bold';
    if (count < TARGET_SYLLABLES) return 'text-amber-500';
    return 'text-red-500';
  };

  // Get the rhyme pattern letter for a verse
  const getPatternLetter = (index: number) => {
    return index < DECIMA_PATTERN.length ? DECIMA_PATTERN[index] : '';
  };

  // Get rhyme suggestions for a specific verse
  const getRhymeSuggestionsForVerse = (index: number) => {
    const patternLetter = getPatternLetter(index);
    return rhymeSuggestions[patternLetter] || [];
  };

  // Get background color based on pattern letter (softer colors)
  const getPatternColor = (index: number) => {
    const letter = getPatternLetter(index).toUpperCase();
    const colors: Record<string, string> = {
      'A': 'bg-rose-50 border-rose-200 text-rose-700',
      'B': 'bg-sky-50 border-sky-200 text-sky-700',
      'C': 'bg-indigo-50 border-indigo-200 text-indigo-700',
      'D': 'bg-amber-50 border-amber-200 text-amber-700',
    };
    return colors[letter] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  // Update last word suggestions based on the pattern
  const updateLastWordSuggestions = (index: number) => {
    const currentLetter = getPatternLetter(index);
    const currentLetterLower = currentLetter.toLowerCase();
    
    // Find verses with the same pattern letter (lowercase)
    const matchingVerseIndex = DECIMA_PATTERN.indexOf(currentLetterLower);
    
    if (matchingVerseIndex !== -1 && verses[matchingVerseIndex]) {
      // Get the last word of the matching verse
      const lastWord = verses[matchingVerseIndex].split(' ').pop() || '';
      if (lastWord.length > 2) {
        // Find rhyming words
        const rhymes = findRhymingWords(lastWord, 8);
        setLastWordSuggestions(rhymes);
        return;
      }
    }
    
    setLastWordSuggestions([]);
  };

  // Apply a suggested word to the end of the current verse
  const applySuggestion = (word: string) => {
    if (activeVerseIndex < 0 || activeVerseIndex >= verses.length) return;
    
    const currentVerse = verses[activeVerseIndex];
    const words = currentVerse.split(' ');
    
    // Replace the last word or add the suggestion
    if (words.length > 0 && words[words.length - 1].trim()) {
      words[words.length - 1] = word;
    } else {
      words.push(word);
    }
    
    handleVerseChange(activeVerseIndex, words.join(' '));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
      {/* Left side - Verses input */}
      <div className="flex flex-col h-full overflow-y-auto p-4 bg-white rounded-lg shadow-lg">
        {/* Title input */}
        <div className="mb-4">
          <label htmlFor="decima-title" className="block text-sm font-medium text-gray-700 mb-1">
            Título de tu Décima
          </label>
          <input
            id="decima-title"
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Escribe un título para tu décima"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-black"
          />
        </div>
        
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Versos</h2>
        
        <div className="space-y-2 flex-grow">
          {verses.map((verse, index) => (
            <div 
              key={index} 
              className={`flex items-center space-x-2 p-2 rounded-lg border ${
                activeVerseIndex === index ? 'border-gray-400 shadow-sm bg-gray-50' : 'border-transparent'
              }`}
              onClick={() => setActiveVerseIndex(index)}
            >
              <span className={`font-mono text-sm font-bold w-6 h-6 flex items-center justify-center ${getPatternColor(index)} rounded-full`}>
                {getPatternLetter(index)}
              </span>
              
              <div className="flex-1">
                <input
                  type="text"
                  value={verse}
                  onChange={(e) => handleVerseChange(index, e.target.value)}
                  placeholder={`Verso ${index + 1} (8 sílabas)`}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-black"
                  onFocus={() => setActiveVerseIndex(index)}
                />
              </div>
              
              <span className={`w-6 text-center ${getSyllableCountClass(syllableCounts[index])}`}>
                {syllableCounts[index]}
              </span>
            </div>
          ))}
        </div>
        
        {/* Word suggestions for active verse */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Sugerencias para finalizar el verso:</h3>
          {lastWordSuggestions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {lastWordSuggestions.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => applySuggestion(word)}
                  className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm text-gray-800 transition-colors"
                >
                  {word}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic text-sm">
              {getPatternLetter(activeVerseIndex) === getPatternLetter(activeVerseIndex).toUpperCase() 
                ? "Escribe un verso con la misma letra en minúscula para ver sugerencias" 
                : "Escribe algunas palabras para ver sugerencias"}
            </p>
          )}
        </div>
        
        {/* Rhyme suggestions for active verse */}
        {getPatternLetter(activeVerseIndex) === getPatternLetter(activeVerseIndex).toUpperCase() && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Sugerencias de rima:</h3>
            {getRhymeSuggestionsForVerse(activeVerseIndex).length > 0 ? (
              <p className="text-gray-700">
                {getRhymeSuggestionsForVerse(activeVerseIndex).join(', ')}
              </p>
            ) : (
              <p className="text-gray-500 italic text-sm">
                Escribe un verso con la misma letra en minúscula para ver sugerencias
              </p>
            )}
          </div>
        )}
        
        {/* Save and View buttons */}
        <div className="mt-4 flex space-x-3">
          <button 
            onClick={handleSave}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors"
          >
            {editId ? 'Actualizar Décima' : 'Guardar Décima'}
          </button>
          <button 
            onClick={handleViewSaved}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors"
          >
            Ver Guardadas
          </button>
        </div>
        
        {/* Save message */}
        {saveMessage && (
          <div className="mt-3 p-2 bg-green-50 text-green-700 rounded-lg text-center">
            {saveMessage}
          </div>
        )}
      </div>
      
      {/* Right side - Visualization and Preview */}
      <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Visualization */}
        <div className="flex-1 flex items-center justify-center bg-[#1e293b] p-4">
          <DecimaGraph 
            pattern={DECIMA_PATTERN} 
            verses={verses} 
            activeVerseIndex={activeVerseIndex} 
          />
        </div>
        
        {/* Preview */}
        <div className="p-4 bg-white border-t border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">
            {title ? title : 'Tu Décima'}
          </h3>
          <div className="whitespace-pre-line text-gray-800 max-h-32 overflow-y-auto">
            {verses.filter(v => v.trim()).join('\n')}
          </div>
        </div>
      </div>
    </div>
  );
} 