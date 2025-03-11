'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSavedDecimas, deleteDecima, SavedDecima } from '../utils/storage';
import Link from 'next/link';

export default function SavedDecimas() {
  const router = useRouter();
  const [decimas, setDecimas] = useState<SavedDecima[]>([]);
  const [deleteMessage, setDeleteMessage] = useState<string>('');

  // Load saved decimas on component mount
  useEffect(() => {
    const savedDecimas = getSavedDecimas();
    setDecimas(savedDecimas);
  }, []);

  // Clear delete message after 3 seconds
  useEffect(() => {
    if (deleteMessage) {
      const timer = setTimeout(() => {
        setDeleteMessage('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [deleteMessage]);

  // Handle delete
  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta décima?')) {
      const success = deleteDecima(id);
      if (success) {
        setDecimas(decimas.filter(d => d.id !== id));
        setDeleteMessage('Décima eliminada con éxito');
      }
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Navigate to create new
  const handleCreateNew = () => {
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Mis Décimas Guardadas</h1>
        <p className="text-xl text-gray-600">
          Revisa y edita tus décimas guardadas
        </p>
      </header>
      
      {/* Delete message */}
      {deleteMessage && (
        <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-lg text-center">
          {deleteMessage}
        </div>
      )}
      
      {decimas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg shadow">
          <p className="text-gray-600 mb-4">No tienes décimas guardadas todavía.</p>
          <button
            onClick={handleCreateNew}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors"
          >
            Crear Mi Primera Décima
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decimas.map(decima => (
            <div key={decima.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">{decima.title}</h2>
                <p className="text-sm text-gray-500">
                  Creada: {formatDate(decima.createdAt)}
                </p>
                {decima.updatedAt !== decima.createdAt && (
                  <p className="text-sm text-gray-500">
                    Actualizada: {formatDate(decima.updatedAt)}
                  </p>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 max-h-40 overflow-y-auto">
                <div className="whitespace-pre-line text-gray-700">
                  {decima.verses.join('\n')}
                </div>
              </div>
              
              <div className="p-3 bg-white border-t border-gray-200 flex justify-between">
                <Link 
                  href={`/edit/${decima.id}`}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(decima.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 