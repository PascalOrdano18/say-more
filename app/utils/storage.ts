// Types for our storage
export interface SavedDecima {
  id: string;
  title: string;
  verses: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'saved_decimas';

// Get all saved decimas
export function getSavedDecimas(): SavedDecima[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) {
      return [];
    }
    
    return JSON.parse(savedData);
  } catch (error) {
    console.error('Error retrieving saved decimas:', error);
    return [];
  }
}

// Save a new decima
export function saveDecima(title: string, verses: string[], description: string): SavedDecima {
  const decimas = getSavedDecimas();
  
  // Create a new decima object
  const newDecima: SavedDecima = {
    id: generateId(),
    title: title || 'Décima sin título',
    verses: verses.filter(verse => verse.trim() !== ''),
    description: description || 'Decima sin descripcion',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Add to the list and save
  const updatedDecimas = [newDecima, ...decimas];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDecimas));
  
  return newDecima;
}

// Update an existing decima
export function updateDecima(id: string, title: string, verses: string[], description: string): SavedDecima | null {
  const decimas = getSavedDecimas();
  const index = decimas.findIndex(d => d.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Update the decima
  const updatedDecima: SavedDecima = {
    ...decimas[index],
    title: title || decimas[index].title,
    verses: verses.filter(verse => verse.trim() !== ''),
    description: description || decimas[index].description,
    updatedAt: new Date().toISOString()
  };
  
  // Replace in the list and save
  decimas[index] = updatedDecima;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decimas));
  
  return updatedDecima;
}

// Delete a decima
export function deleteDecima(id: string): boolean {
  const decimas = getSavedDecimas();
  const updatedDecimas = decimas.filter(d => d.id !== id);
  
  if (updatedDecimas.length === decimas.length) {
    return false; // Nothing was deleted
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDecimas));
  return true;
}

// Get a single decima by ID
export function getDecimaById(id: string): SavedDecima | null {
  const decimas = getSavedDecimas();
  return decimas.find(d => d.id === id) || null;
}

// Helper function to generate a unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
} 