import Link from 'next/link';
import SearchForm from './components/SearchForm';
import ResultsList from './components/ResultsList';
import { Suspense } from 'react';

export default async function Home(props: {
  searchParams?: Promise<{
    q?: string;
    city?: string;
    t?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || '';
  const city = searchParams?.city || '';
  const timestamp = searchParams?.t || '';

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo-up.png" 
                alt="Logo" 
                className="h-12 md:h-[70px] w-auto"
              />
            </div>
            <div className="flex gap-4">
              <Link 
                href="#search"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Encontrar Fieles
              </Link>
              <Link 
                href="/agregar"
                className="text-sm font-medium text-blue-900 hover:text-blue-700 transition-colors"
              >
                Reportar Fiel
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-white pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        {/* Minimalist Ecuador Accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 flex">
            <div className="w-1/2 bg-yellow-400"></div>
            <div className="w-1/4 bg-blue-700"></div>
            <div className="w-1/4 bg-red-600"></div>
        </div>
        
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-light tracking-tight sm:text-5xl md:text-6xl text-slate-900">
            Registro Nacional <span className="font-bold">De Fieles</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
            Bienvenido, aquí solo están los más fieles. Si encuentras a tu persona aquí, ¡felicidades! Tienes oro puro y eres muy afortunado/a.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full space-y-8">
          {/* Search and Results Area */}
          <div id="search">
            <Suspense fallback={<div>Cargando formulario...</div>}>
              <SearchForm />
            </Suspense>
          </div>
          
          <ResultsList term={query} city={city} refreshKey={timestamp} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Registro Nacional De Infieles. República del Ecuador.
          </p>
        </div>
      </footer>
    </div>
  );
}
