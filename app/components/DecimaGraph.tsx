'use client';

import React, { useMemo } from 'react';
import { getWordEnding } from '../utils/rhymeHelper';
import { countSyllablesInVerse } from '../utils/syllableCounter';

interface DecimaGraphProps {
  pattern: string;
  verses: string[];
  activeVerseIndex: number;
  onVerseClick?: (index: number) => void;
}

const DecimaGraph: React.FC<DecimaGraphProps> = ({ 
  pattern, 
  verses, 
  activeVerseIndex, 
  onVerseClick 
}) => {
  // Colors for different rhyme patterns
  const rhymeColors = useMemo<Record<string, string>>(() => ({
    'A': '#ef4444', // Red
    'B': '#3b82f6', // Blue  
    'C': '#8b5cf6', // Purple
    'D': '#f59e0b', // Amber
  }), []);

  // Get syllable counts for all verses
  const syllableCounts = useMemo(() => 
    verses.map(verse => countSyllablesInVerse(verse)), 
    [verses]
  );

  // Get rhyme endings
  const rhymeEndings = useMemo(() => 
    verses.map(verse => {
      if (!verse.trim()) return '';
      const words = verse.split(' ');
      const lastWord = words[words.length - 1] || '';
      return getWordEnding(lastWord);
    }), 
    [verses]
  );

  // Group verses by rhyme pattern
  const rhymeGroups = useMemo(() => {
    const groups: Record<string, number[]> = {};
    for (let i = 0; i < pattern.length; i++) {
      const letter = pattern[i].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(i);
    }
    return groups;
  }, [pattern]);

  const getVerseStatus = (index: number) => {
    const verse = verses[index];
    const syllables = syllableCounts[index];
    
    if (!verse.trim()) return 'empty';
    if (syllables < 7) return 'short';
    if (syllables > 9) return 'long';
    if (syllables === 8) return 'perfect';
    return 'close';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'perfect': return 'bg-green-500';
      case 'close': return 'bg-yellow-500';
      case 'short': return 'bg-orange-500';
      case 'long': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const completedVerses = verses.filter(v => v.trim()).length;
  const perfectVerses = syllableCounts.filter(count => count === 8).length;

  return (
    <div className="bg-white p-6 space-y-6">
      {/* Header Stats */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Progreso de la Décima</h3>
          <p className="text-sm text-gray-600">
            {completedVerses}/10 versos • {perfectVerses} con métrica perfecta
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">{Math.round((completedVerses / 10) * 100)}%</div>
          <div className="text-xs text-gray-500">completado</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(completedVerses / 10) * 100}%` }}
        ></div>
      </div>

      {/* Rhyme Pattern Legend */}
      <div className="flex items-center justify-center space-x-6 py-2">
        {Object.entries(rhymeGroups).map(([letter, indices]) => (
          <div key={letter} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: rhymeColors[letter] }}
            ></div>
            <span className="text-sm font-medium text-gray-700">
              {letter} ({indices.length})
            </span>
          </div>
        ))}
      </div>

      {/* Verse Grid */}
      <div className="grid grid-cols-5 gap-3">
        {verses.map((verse, index) => {
          const status = getVerseStatus(index);
          const isActive = index === activeVerseIndex;
          const rhymeLetter = pattern[index].toUpperCase();
          const rhymeColor = rhymeColors[rhymeLetter];
          
          return (
            <div
              key={index}
              className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                isActive 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
              onClick={() => onVerseClick?.(index)}
            >
              {/* Verse Number & Rhyme Letter */}
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-gray-600">
                  {index + 1}
                </span>
                <div className="flex items-center space-x-1">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: rhymeColor }}
                  ></div>
                  <span className="text-xs font-medium text-gray-600">
                    {rhymeLetter}
                  </span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-between mb-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}></div>
                <span className="text-xs text-gray-500">
                  {syllableCounts[index]} sílabas
                </span>
              </div>

              {/* Verse Preview or Empty State */}
              {verse.trim() ? (
                <div className="space-y-1">
                  <p className="text-xs text-gray-700 line-clamp-2 leading-tight">
                    {verse.substring(0, 40)}{verse.length > 40 ? '...' : ''}
                  </p>
                  {rhymeEndings[index] && (
                    <p className="text-xs text-gray-500 font-medium">
                      -{rhymeEndings[index]}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-2">
                  <div className="w-8 h-8 mx-auto border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-xs">+</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Vacío</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Rhyme Groups Visualization */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Grupos de Rima</h4>
        {Object.entries(rhymeGroups).map(([letter, indices]) => (
          <div key={letter} className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: rhymeColors[letter] }}
            >
              {letter}
            </div>
            <div className="flex-1 flex space-x-1">
              {indices.map(i => (
                <div
                  key={i}
                  className={`px-2 py-1 rounded text-xs ${
                    verses[i].trim() 
                      ? 'bg-gray-100 text-gray-700' 
                      : 'bg-gray-50 text-gray-400 border border-dashed border-gray-300'
                  } ${i === activeVerseIndex ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => onVerseClick?.(i)}
                  style={{ cursor: 'pointer' }}
                >
                  {i + 1}
                  {rhymeEndings[i] && (
                    <span className="ml-1 text-gray-500">
                      -{rhymeEndings[i]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Status Legend */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Estado de Métrica</h4>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>8 sílabas (perfecto)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span>7 o 9 sílabas (aceptable)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span>Muy pocas sílabas</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span>Demasiadas sílabas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecimaGraph; 