'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { countSyllablesInVerse } from '../utils/syllableCounter';
import { getSuggestedRhymes, findRhymingWords } from '../utils/rhymeHelper';
import { saveDecima, updateDecima } from '../utils/storage';
import DecimaGraph from './DecimaGraph';

const DECIMA_PATTERN = 'ABBAACCDDC';
const TARGET_SYLLABLES = 8;

interface DecimaEditorProps {
  editId?: string;
  initialTitle?: string;
  initialVerses?: string[];
  initialDescription?: string;
}

export default function DecimaEditor({ editId, initialTitle = '', initialVerses = Array(10).fill(''), initialDescription = '' }: DecimaEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState<string>(initialTitle);
  const [verses, setVerses] = useState<string[]>(initialVerses.length === 10 ? initialVerses : Array(10).fill(''));
  const [description, setDescription] = useState<string>(initialDescription);
  const [syllableCounts, setSyllableCounts] = useState<number[]>(Array(10).fill(0));
  const [rhymeSuggestions, setRhymeSuggestions] = useState<Record<string, string[]>>({});
  const [activeVerseIndex, setActiveVerseIndex] = useState<number>(0);
  const [lastWordSuggestions, setLastWordSuggestions] = useState<string[]>([]);
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [activeGraph, setActiveGraph] = useState<boolean>(true);

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

  const handleDescriptionChange = (value: string) => {
    console.log(description);
    setDescription(value);
  }

  // Handle save
  const handleSave = () => {
    // Filter out empty verses
    const nonEmptyVerses = verses.filter(verse => verse.trim() !== '');
    
    // Check if we have at least one verse
    if (nonEmptyVerses.length === 0) {
      setSaveMessage('Por favor, escribe al menos un verso antes de guardar.');
      return;
    }
    
    try {
      // Save or update the decima
      if (editId) {
        const updated = updateDecima(editId, title, verses, description);
        if (updated) {
          setSaveMessage('¡Décima actualizada con éxito! Puedes verla en "Guardadas"');
        } else {
          setSaveMessage('Error al actualizar la décima. Por favor, intenta de nuevo.');
        }
      } else {
        const saved = saveDecima(title, verses, description);
        if (saved) {
          setSaveMessage('¡Décima guardada con éxito! Puedes verla en "Guardadas"');
        } else {
          setSaveMessage('Error al guardar la décima. Por favor, intenta de nuevo.');
        }
      }
      
      // Log storage status to console for debugging
      console.log('Current storage:', localStorage.getItem('saved_decimas'));
    } catch (error) {
      console.error('Error saving decima:', error);
      setSaveMessage('Ocurrió un error al guardar. ' + (error instanceof Error ? error.message : String(error)));
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
      'A': 'bg-rose-100 text-rose-800 border-rose-300',
      'B': 'bg-sky-100 text-sky-800 border-sky-300',
      'C': 'bg-violet-100 text-violet-800 border-violet-300',
      'D': 'bg-amber-100 text-amber-800 border-amber-300',
    };
    return colors[letter] || 'bg-gray-100 text-gray-800 border-gray-300';
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

  // Get properly formatted verse preview with real line breaks
  const getFormattedPreview = () => {
    return verses.filter(v => v.trim()).join('\n');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {/* Left side - Verses input */}
      <div className="flex flex-col bg-white rounded-xl shadow-md h-fit max-h-screen overflow-y-auto">
        {/* Title input */}
        <div className="p-4 pb-2">
          <div className='w-full grid grid-cols-2'>
            <label htmlFor="decima-title" className="block text-sm font-medium text-gray-700 mb-2">
              Título de tu Décima
            </label>
            <button 
              className='px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-700 hover:text-gray-700 hover:bg-gray-100 transition-all hover:cursor-pointer'
              onClick={() => setActiveGraph(!activeGraph)}
              >
              Grafo
            </button>
          </div>
          <input
            id="decima-title"
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Escribe un título para tu décima"
            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-black shadow-sm"
          />
        </div>
        
        <div className="px-4 pb-1">
          <h2 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
            <span>Versos</span>
            <span className="ml-auto text-xs font-normal text-gray-500">(8 sílabas por verso)</span>
          </h2>
        </div>
        
        {/* Compact verse layout to fit all on screen */}
        <div className="px-4 pb-2 space-y-1">
          {verses.map((verse, index) => (
            <div 
              key={index} 
              className={`flex items-center space-x-2 p-1.5 rounded-md border transition-all ${
                activeVerseIndex === index ? 'border-indigo-400 shadow-sm bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setActiveVerseIndex(index)}
            >
              <span className={`font-mono text-xs font-bold w-6 h-6 flex items-center justify-center ${getPatternColor(index)} rounded-full shadow-sm`}>
                {getPatternLetter(index)}
              </span>
              
              <div className="flex-1">
                <input
                  type="text"
                  value={verse}
                  onChange={(e) => handleVerseChange(index, e.target.value)}
                  placeholder={`Verso ${index + 1}`}
                  className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-black"
                  onFocus={() => setActiveVerseIndex(index)}
                />
              </div>
              
              <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${
                syllableCounts[index] === TARGET_SYLLABLES 
                  ? 'bg-green-100 text-green-800' 
                  : syllableCounts[index] > TARGET_SYLLABLES 
                    ? 'bg-red-100 text-red-800'
                    : syllableCounts[index] === 0
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-amber-100 text-amber-800'
              }`}>
                {syllableCounts[index]}
              </span>
            </div>
          ))}
        </div>

                  <div className='text-black mx-4 my-2'>
          <h2 className='text-sm font-medium text-gray-700 mb-1'>Descripción</h2>
            <textarea 
              className='w-full h-16 text-sm text-black border border-gray-300 rounded-md p-2 resize-none' 
              placeholder="Descripción opcional de tu décima..."
              onChange={(e) => handleDescriptionChange(e.target.value)} 
              />
          </div>

        
        {/* Word suggestions for active verse - Compact */}
        <div className="px-4 pb-3 mt-2">
          <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="text-xs font-medium text-gray-700 mb-2">Sugerencias para rimar:</h3>
            {lastWordSuggestions.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {lastWordSuggestions.slice(0, 6).map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => applySuggestion(word)}
                    className="px-2 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded text-xs font-medium transition-colors"
                  >
                    {word}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic text-xs">
                {getPatternLetter(activeVerseIndex) === getPatternLetter(activeVerseIndex).toUpperCase() 
                  ? "Escribe un verso con la misma letra en minúscula para ver sugerencias" 
                  : "Escribe algunas palabras para ver sugerencias"}
              </p>
            )}
          </div>
        </div>
      
        
        {/* Save and View buttons */}
        <div className="px-4 pb-4">
          <div className="flex space-x-4">
            <button 
              onClick={handleSave}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg shadow-sm transition-colors font-medium"
            >
              {editId ? 'Actualizar Décima' : 'Guardar Décima'}
            </button>
            <button 
              onClick={handleViewSaved}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg shadow-sm transition-colors font-medium border border-gray-300"
            >
              Ver Guardadas
            </button>
          </div>
          
          {/* Save message */}
          {saveMessage && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-center font-medium border border-green-200">
              {saveMessage}
            </div>
          )}
        </div>
      </div>
      
      {/* Right side - Visualization and Preview */}
      <div className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden h-fit max-h-screen">
        {/* Visualization */}
        {activeGraph && 
        <div className="border-b border-gray-200">
          <DecimaGraph 
            pattern={DECIMA_PATTERN} 
            verses={verses} 
            activeVerseIndex={activeVerseIndex}
            onVerseClick={setActiveVerseIndex}
          />
        </div>  
        }
        
        
        {/* Preview - Fixed to properly display line breaks */}
        <div className={`p-6 bg-white ${activeGraph ? 'border-t border-gray-200' : ''}`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800 text-lg">
              {title ? title : 'Tu Décima'}
            </h3>
            <button
              onClick={() => setActiveGraph(!activeGraph)}
              className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {activeGraph ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878a3 3 0 105.303 5.303m0 0L8.464 8.464m5.303 5.303a3 3 0 01-4.243-4.243m0 0L8.464 8.464" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                )}
              </svg>
              <span>{activeGraph ? 'Ocultar gráfico' : 'Mostrar gráfico'}</span>
            </button>
          </div>
          <div className="font-sans leading-relaxed">
            {verses.filter(v => v.trim()).map((verse, index) => (
              <p key={index} className="mb-2 text-gray-800">{verse}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 