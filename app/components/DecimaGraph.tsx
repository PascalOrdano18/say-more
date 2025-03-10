'use client';

import React, { useEffect, useRef, useMemo } from 'react';

interface DecimaGraphProps {
  pattern: string;
  verses: string[];
  activeVerseIndex: number;
}

const DecimaGraph: React.FC<DecimaGraphProps> = ({ pattern, verses, activeVerseIndex }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Colors for different rhyme patterns (softer palette)
  const colors = useMemo<Record<string, string>>(() => ({
    'A': '#f43f5e', // Rose
    'B': '#e5e7eb', // Light gray
    'C': '#6366f1', // Indigo
    'D': '#f59e0b', // Amber
  }), []);
  
  // Calculate positions for each node in a circle
  const getNodePositions = (numNodes: number, radius: number, centerX: number, centerY: number) => {
    const positions = [];
    for (let i = 0; i < numNodes; i++) {
      // Start from the top (270 degrees) and go clockwise
      const angle = (Math.PI * 2 * i / numNodes) - (Math.PI / 2);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positions.push({ x, y });
    }
    return positions;
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const size = Math.min(window.innerWidth, 500);
    canvas.width = size;
    canvas.height = size;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width * 0.35;
    
    // Get positions for each verse node
    const positions = getNodePositions(10, radius, centerX, centerY);
    
    // Draw connections based on rhyme pattern
    const patternMap: Record<string, number[]> = {};
    
    // Group verse indices by pattern letter
    for (let i = 0; i < pattern.length; i++) {
      const letter = pattern[i].toUpperCase();
      if (!patternMap[letter]) {
        patternMap[letter] = [];
      }
      patternMap[letter].push(i);
    }
    
    // Draw connections
    for (const letter in patternMap) {
      const indices = patternMap[letter];
      if (indices.length > 1) {
        const color = colors[letter] || '#999';
        
        // Use semi-transparent colors for connections
        ctx.strokeStyle = color + '80'; // 50% opacity
        ctx.lineWidth = 1.5;
        
        for (let i = 0; i < indices.length; i++) {
          for (let j = i + 1; j < indices.length; j++) {
            const pos1 = positions[indices[i]];
            const pos2 = positions[indices[j]];
            
            // Only draw connections if at least one of the verses has content
            if (verses[indices[i]] || verses[indices[j]]) {
              ctx.beginPath();
              ctx.moveTo(pos1.x, pos1.y);
              ctx.lineTo(pos2.x, pos2.y);
              ctx.stroke();
            }
          }
        }
      }
    }
    
    // Draw nodes
    for (let i = 0; i < positions.length; i++) {
      const { x, y } = positions[i];
      const letter = pattern[i].toUpperCase();
      const color = colors[letter] || '#999';
      
      // Draw circle
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      
      // Fill based on whether the verse has content and if it's active
      if (i === activeVerseIndex) {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
      } else {
        ctx.fillStyle = verses[i] ? color : '#e5e7eb';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
      }
      
      ctx.fill();
      ctx.stroke();
      
      // Draw number
      ctx.fillStyle = i === activeVerseIndex || !verses[i] ? '#1f2937' : '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((i + 1).toString(), x, y);
    }
    
    // Draw title in the center
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DÉCIMA', centerX, centerY - 10);
    
    // Draw pattern below title
    ctx.font = '14px Arial';
    ctx.fillText(pattern, centerX, centerY + 15);
    
    // Draw caption at the bottom
    ctx.font = '12px Arial';
    ctx.fillStyle = '#d1d5db';
    ctx.fillText('Visualización del patrón de rima', centerX, centerY + radius + 30);
    
  }, [pattern, verses, activeVerseIndex, colors]);
  
  return (
    <div className="flex justify-center">
      <canvas 
        ref={canvasRef} 
        className="max-w-full rounded-lg shadow-sm"
        style={{ background: '#1e293b' }}
      />
    </div>
  );
};

export default DecimaGraph; 