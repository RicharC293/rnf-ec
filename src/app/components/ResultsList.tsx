'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useCities } from '../../hooks/useCities';
import ResultCard from './ResultCard';

interface Result {
  id: string;
  first_name: string;
  last_name: string;
  city_id: string;
  description: string;
  age?: number;
  gender?: string;
  created_at?: Timestamp | Date;
}

interface ResultsListProps {
  term: string;
  city: string;
  refreshKey?: string;
}

export default function ResultsList({ term, city, refreshKey }: ResultsListProps) {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { cities } = useCities();

  const getCityName = (cityId: string) => {
    const foundCity = cities.find(c => c.id === cityId);
    return foundCity ? foundCity.name : 'Ciudad desconocida';
  };

  useEffect(() => {
    const fetchResults = async () => {
      // Si no hay término de búsqueda ni ciudad, no hacemos nada
      if (!term.trim() && !city) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setHasSearched(true);
      try {
        const resultsRef = collection(db, 'registros');
        let q;

        if (city) {
           // Si se ha seleccionado la ciudad, buscamos en esa ciudad
           // Nota: Esto requiere un índice compuesto en Firestore: city_id ASC, created_at DESC
           q = query(resultsRef, where('city_id', '==', city), orderBy('created_at', 'desc'), limit(50));
        } else {
           // Si no se ha seleccionado ciudad, buscamos en general (limitado para ahorrar recursos)
           q = query(resultsRef, orderBy('created_at', 'desc'), limit(50));
        }

        const querySnapshot = await getDocs(q);
        let data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Result));

        // Filtrado en cliente para búsqueda parcial de nombre/apellido si existe término
        if (term.trim()) {
          const lowerTerm = term.toLowerCase();
          data = data.filter(item => {
            const fullName = `${item.first_name} ${item.last_name}`.toLowerCase();
            return fullName.includes(lowerTerm);
          });
        }

        setResults(data);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [term, city, refreshKey]);

  if (!hasSearched) {
    return (
      <div className="text-center text-gray-500 mt-8">
        <p>Ingresa un nombre, apellido o ciudad para realizar una búsqueda.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center mt-8">Cargando resultados...</div>;
  }

  if (results.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        <p>No se encontraron resultados.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-light mb-6 text-slate-900">Resultados</h3>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {results.map((result) => (
          <ResultCard 
            key={result.id} 
            result={result} 
            cityName={getCityName(result.city_id)} 
          />
        ))}
      </div>
    </div>
  );
}
