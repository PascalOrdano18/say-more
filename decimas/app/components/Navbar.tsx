'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              Décimas
            </Link>
          </div>
          
          <div className="flex space-x-4">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Crear
            </Link>
            
            <Link 
              href="/saved" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/saved' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Guardadas
            </Link>
            
            <Link 
              href="/debug" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/debug' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Debug
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 