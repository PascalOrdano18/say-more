'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DebugPage() {
  const [storageData, setStorageData] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    try {
      const data = localStorage.getItem('saved_decimas');
      setStorageData(data || 'No data found in localStorage');
    } catch (err) {
      setError('Error accessing localStorage: ' + (err instanceof Error ? err.message : String(err)));
    }
  }, []);

  const handleClearStorage = () => {
    try {
      localStorage.removeItem('saved_decimas');
      setStorageData('Storage cleared successfully');
    } catch (err) {
      setError('Error clearing localStorage: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleTestStorage = () => {
    try {
      // Test localStorage by setting and getting a value
      localStorage.setItem('test_key', 'test_value');
      const testValue = localStorage.getItem('test_key');
      
      if (testValue === 'test_value') {
        alert('localStorage is working correctly!');
      } else {
        alert('localStorage test failed: Value retrieved does not match value set');
      }
      
      localStorage.removeItem('test_key');
    } catch (err) {
      alert('localStorage test failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Debugging localStorage</h1>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-lg text-red-700 mb-6">
          {error}
        </div>
      )}
      
      <div className="flex space-x-4 mb-6">
        <button
          onClick={handleTestStorage}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Test localStorage
        </button>
        
        <button
          onClick={handleClearStorage}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Clear Saved Décimas
        </button>
        
        <Link href="/saved" className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded inline-block">
          Go to Saved Décimas
        </Link>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">localStorage Content:</h2>
        <pre className="bg-white p-4 rounded border border-gray-200 overflow-auto max-h-96">
          {storageData}
        </pre>
      </div>
    </div>
  );
} 