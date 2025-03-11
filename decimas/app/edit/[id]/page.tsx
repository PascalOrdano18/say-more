'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDecimaById } from '../../utils/storage';
import DecimaEditor from '../../components/DecimaEditor';

interface EditDecimaPageProps {
  params: {
    id: string;
  };
}

export default function EditDecimaPage({ params }: EditDecimaPageProps) {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [verses, setVerses] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Get the decima by ID
    const decima = getDecimaById(params.id);
    
    if (!decima) {
      setError('No se encontró la décima solicitada');
      setLoading(false);
      return;
    }
    
    setTitle(decima.title);
    setVerses(decima.verses);
    setLoading(false);
  }, [params.id]);

  // Handle back to saved
  const handleBackToSaved = () => {
    router.push('/saved');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-lg text-red-700 mb-4">
          {error}
        </div>
        <button
          onClick={handleBackToSaved}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors"
        >
          Volver a Mis Décimas
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Editar Décima</h1>
        <button
          onClick={handleBackToSaved}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors"
        >
          Volver a Mis Décimas
        </button>
      </div>
      
      <DecimaEditor 
        editId={params.id}
        initialTitle={title}
        initialVerses={verses}
      />
    </div>
  );
} 