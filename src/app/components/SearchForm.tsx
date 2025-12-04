'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useCities } from '../../hooks/useCities';

export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [term, setTerm] = useState(searchParams.get('q') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const { cities, loading: loadingCities } = useCities();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (term) params.set('q', term);
    if (city) params.set('city', city);
    params.set('t', Date.now().toString()); // Force refresh
    
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mb-12">
      <h2 className="text-2xl font-light mb-2 text-slate-900">Consulta de registros</h2>
      <p className="text-slate-500 mb-6 font-light">Busca por nombre/apellido y filtra por ciudad.</p>
      
      <form onSubmit={handleSearch} className="space-y-4 md:space-y-0 md:flex md:gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre o apellido"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 text-slate-900 placeholder:text-slate-400 transition-all"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <select
            className={`w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 bg-white transition-all ${city === '' ? 'text-slate-400' : 'text-slate-900'}`}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={loadingCities}
          >
            <option value="" className="text-slate-400">Todas las ciudades</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id} className="text-slate-900">
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-900 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium shadow-sm"
          >
            Consultar
          </button>
        </div>
      </form>
    </div>
  );
}
