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
    'B': '#0ea5e9', // Sky blue
    'C': '#8b5cf6', // Violet
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
    
    // Set canvas dimensions with higher resolution for retina displays
    const dpr = window.devicePixelRatio || 1;
    const size = Math.min(window.innerWidth, 500);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.35;
    
    // Get positions for each verse node
    const positions = getNodePositions(10, radius, centerX, centerY);
    
    // Add background gradient
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius * 1.5
    );
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
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
        ctx.strokeStyle = color + '60'; // 40% opacity
        ctx.lineWidth = 2;
        
        // Create a path for all connections of this letter
        ctx.beginPath();
        
        // Draw arcs instead of straight lines for a more elegant look
        for (let i = 0; i < indices.length; i++) {
          for (let j = i + 1; j < indices.length; j++) {
            const pos1 = positions[indices[i]];
            const pos2 = positions[indices[j]];
            
            // Only draw connections if at least one of the verses has content
            if (verses[indices[i]] || verses[indices[j]]) {
              // Calculate midpoint with a slight offset for a curved line
              const midX = (pos1.x + pos2.x) / 2;
              const midY = (pos1.y + pos2.y) / 2;
              const distance = Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
              
              // Move toward center for a nice curve
              const offsetX = (centerX - midX) * 0.3;
              const offsetY = (centerY - midY) * 0.3;
              
              ctx.moveTo(pos1.x, pos1.y);
              ctx.quadraticCurveTo(midX + offsetX, midY + offsetY, pos2.x, pos2.y);
            }
          }
        }
        
        ctx.stroke();
      }
    }
    
    // Draw nodes
    for (let i = 0; i < positions.length; i++) {
      const { x, y } = positions[i];
      const letter = pattern[i].toUpperCase();
      const color = colors[letter] || '#999';
      
      // Draw glow for active node
      if (i === activeVerseIndex) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
      } else {
        ctx.shadowBlur = 0;
      }
      
      // Draw circle with gradient
      const circleGradient = ctx.createRadialGradient(
        x, y, 0,
        x, y, 25
      );
      
      // Fill based on whether the verse has content and if it's active
      if (i === activeVerseIndex) {
        circleGradient.addColorStop(0, '#ffffff');
        circleGradient.addColorStop(1, '#f8fafc');
        ctx.fillStyle = circleGradient;
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
      } else {
        if (verses[i]) {
          circleGradient.addColorStop(0, color);
          circleGradient.addColorStop(1, shadeColor(color, -20));
          ctx.fillStyle = circleGradient;
        } else {
          ctx.fillStyle = '#334155';
        }
        ctx.strokeStyle = '#ffffff40'; // semi-transparent white
        ctx.lineWidth = 1.5;
      }
      
      // Draw circle with antialiasing
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Draw number
      ctx.shadowBlur = 0;
      ctx.fillStyle = i === activeVerseIndex ? '#334155' : '#ffffff';
      ctx.font = 'bold 16px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((i + 1).toString(), x, y);
    }
    
    // Draw title in the center
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DÉCIMA', centerX, centerY - 12);
    
    // Draw pattern below title
    ctx.font = '16px Inter, system-ui, sans-serif';
    ctx.fillText(pattern, centerX, centerY + 16);
    
    // Draw caption at the bottom
    ctx.font = '14px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Visualización del patrón de rima', centerX, centerY + radius + 35);
    
  }, [pattern, verses, activeVerseIndex, colors]);
  
  // Helper function to darken a color
  const shadeColor = (color: string, percent: number) => {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = Math.floor(R * (100 + percent) / 100);
    G = Math.floor(G * (100 + percent) / 100);
    B = Math.floor(B * (100 + percent) / 100);

    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;

    const RR = R.toString(16).padStart(2, '0');
    const GG = G.toString(16).padStart(2, '0');
    const BB = B.toString(16).padStart(2, '0');

    return `#${RR}${GG}${BB}`;
  };
  
  return (
    <div className="flex justify-center">
      <canvas 
        ref={canvasRef} 
        className="max-w-full rounded-xl shadow-lg"
      />
    </div>
  );
};

export default DecimaGraph; 