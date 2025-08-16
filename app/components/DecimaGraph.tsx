'use client';

import React, { useMemo } from 'react';
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
  // Minimal colors for different rhyme patterns
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

  const getVerseStatus = (index: number) => {
    const syllables = syllableCounts[index];
    const verse = verses[index];
    
    if (!verse.trim()) return 'empty';
    if (syllables === 8) return 'perfect';
    return 'imperfect';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'perfect': return 'bg-green-400';
      case 'imperfect': return 'bg-amber-400';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="bg-white p-3">
      {/* Ultra-minimalistic verse circles */}
      <div className="flex justify-center space-x-2">
        {verses.map((verse, index) => {
          const status = getVerseStatus(index);
          const isActive = index === activeVerseIndex;
          const rhymeLetter = pattern[index].toUpperCase();
          const rhymeColor = rhymeColors[rhymeLetter];
          
          return (
            <div
              key={index}
              className={`relative w-12 h-12 rounded-full border-2 cursor-pointer transition-all flex items-center justify-center ${
                isActive 
                  ? 'border-blue-500 shadow-md scale-110' 
                  : 'border-gray-200 hover:border-gray-400'
              }`}
              style={{ 
                backgroundColor: status === 'perfect' ? `${rhymeColor}20` : status === 'empty' ? '#f9fafb' : '#fef3cd'
              }}
              onClick={() => onVerseClick?.(index)}
            >
              {/* Verse number */}
              <span 
                className="text-sm font-bold"
                style={{ 
                  color: status === 'perfect' ? rhymeColor : status === 'empty' ? '#9ca3af' : '#d97706'
                }}
              >
                {index + 1}
              </span>
              
              {/* Small rhyme letter indicator */}
              <div 
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: rhymeColor }}
              >
                {rhymeLetter}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DecimaGraph; 