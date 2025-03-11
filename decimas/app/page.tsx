import DecimaEditor from './components/DecimaEditor';

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Creador de Décimas</h1>
        <p className="text-xl text-gray-600">
          Crea poesía española con la estructura perfecta - ABBAACCDDC
        </p>
      </header>
      
      <DecimaEditor />
    </div>
  );
} 