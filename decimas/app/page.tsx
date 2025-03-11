import DecimaEditor from './components/DecimaEditor';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6">
      <div className="container mx-auto px-4">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Décimas</h1>
          <p className="text-xl text-gray-600">
            Crea poesía española con la estructura perfecta
          </p>
        </header>
        
        <DecimaEditor />
        
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Décimas - Una herramienta para crear poesía española con la estructura perfecta</p>
          <p className="mt-1">© {new Date().getFullYear()} - Todos los derechos reservados</p>
        </footer>
      </div>
    </main>
  );
} 