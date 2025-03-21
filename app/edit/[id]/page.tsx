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
  
  // Access the id directly
  const id = params.id;

  useEffect(() => {
    // Get the decima by ID
    const decima = getDecimaById(id);
    
    if (!decima) {
      setError('No se encontró la décima solicitada');
      setLoading(false);
      return;
    }
    
    setTitle(decima.title);
    setVerses(decima.verses);
    setLoading(false);
  }, [id]);

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
    <div className="container mx-auto px-4">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Editar Décima</h1>
        <p className="text-xl text-gray-600">
          Actualiza tu décima guardada
        </p>
      </header>
      
      <DecimaEditor 
        editId={id}
        initialTitle={title}
        initialVerses={verses}
      />
    </div>
  );
} 