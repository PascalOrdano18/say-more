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
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Mis Décimas Guardadas</h1>
        <p className="text-xl text-gray-600 max-w-xl mx-auto">
          Aquí puedes ver, editar y gestionar todas tus décimas guardadas
        </p>
      </header>
      
      {/* Delete message */}
      {deleteMessage && (
        <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-lg text-center font-medium border border-green-200 max-w-md mx-auto">
          {deleteMessage}
        </div>
      )}
      
      {decimas.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl shadow-md max-w-md mx-auto">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="text-gray-600 mb-6 text-lg">No tienes décimas guardadas todavía.</p>
          <button
            onClick={handleCreateNew}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg shadow-sm transition-colors font-medium"
          >
            Crear Mi Primera Décima
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decimas.map(decima => (
            <div key={decima.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">{decima.title}</h2>
                <div className="flex flex-col text-sm text-gray-500 space-y-1">
                  <p className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Creada: {formatDate(decima.createdAt)}
                  </p>
                  {decima.updatedAt !== decima.createdAt && (
                    <p className="flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Actualizada: {formatDate(decima.updatedAt)}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="p-5 bg-gray-50 max-h-48 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm leading-relaxed">
                  {decima.verses.join('\n')}
                </pre>
              </div>
              
              <div className="p-4 bg-white border-t border-gray-200 flex justify-between">
                <Link 
                  href={`/edit/${decima.id}`}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(decima.id)}
                  className="inline-flex items-center text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
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