import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Décimas - Spanish Poetry Creator",
  description: "Create beautiful Spanish décimas with the perfect structure - 10 verses of 8 syllables each with the ABBAACCDDC rhyme pattern.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <Navbar />
          <main className="pt-6">
            {children}
          </main>
          <footer className="mt-8 text-center text-gray-500 text-sm py-6">
            <div className="container mx-auto px-4">
              <p>Décimas - Una herramienta para crear poesía española con la estructura perfecta</p>
              <p className="mt-1">© {new Date().getFullYear()} - Todos los derechos reservados</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
