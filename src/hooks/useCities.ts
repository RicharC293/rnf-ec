import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface City {
  id: string;
  name: string;
  province: string;
}

// Caché global para evitar múltiples lecturas a Firebase en la misma sesión
let cachedCities: City[] | null = null;
let fetchPromise: Promise<City[]> | null = null;

const CACHE_KEY = 'rnf_cities_data_v3'; // Incrementamos versión para limpiar caché antiguo
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

export function useCities() {
  // Inicializamos siempre vacío para evitar Hydration Mismatch
  // (El servidor no tiene caché, el cliente sí podría tenerlo, lo que causaría diferencias)
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Si ya tenemos datos en memoria (sesión actual), usarlos inmediatamente
    if (cachedCities) {
      setCities(cachedCities);
      setLoading(false);
      return;
    }

    const fetchCities = async () => {
      try {
        // Si no hay una petición en curso, iniciamos la lógica de carga
        if (!fetchPromise) {
          fetchPromise = (async () => {
            // 2. Intentar recuperar de LocalStorage (persistencia entre recargas)
            try {
              const storedData = localStorage.getItem(CACHE_KEY);
              if (storedData) {
                const { cities: storedCities, timestamp } = JSON.parse(storedData);
                const now = Date.now();
                
                // Si el caché es válido (menos de 24h), lo usamos
                if (now - timestamp < CACHE_DURATION) {
                  console.log('📍 Usando ciudades desde LocalStorage');
                  return storedCities;
                }
              }
            } catch (e) {
              console.warn('Error leyendo localStorage', e);
            }

            // 3. Si no hay caché válido, consultar Firebase (SINGLE DOCUMENT)
            console.log('🔥 Consultando ciudades desde Firebase (Single Doc)...');
            
            // Leemos el documento único "metadata/cities"
            const docRef = doc(db, 'metadata', 'cities');
            const docSnap = await getDoc(docRef);

            let citiesData: City[] = [];

            if (docSnap.exists()) {
              const data = docSnap.data();
              // Asumimos que el campo se llama 'list' como en el script de subida
              citiesData = (data.list as City[]) || [];
            } else {
              console.warn('No se encontró el documento metadata/cities');
            }

            // SAFETY: Deduplicar por ID para evitar errores de React "same key"
            // Esto protege contra datos corruptos en la DB o JSON
            const uniqueCities = Array.from(new Map(citiesData.map(item => [item.id, item])).values());
            
            if (uniqueCities.length !== citiesData.length) {
              console.warn(`⚠️ Se encontraron ${citiesData.length - uniqueCities.length} duplicados y fueron eliminados.`);
            }

            // 4. Guardar en LocalStorage para el futuro
            try {
              localStorage.setItem(CACHE_KEY, JSON.stringify({
                cities: uniqueCities,
                timestamp: Date.now()
              }));
            } catch (e) {
              console.warn('Error guardando en localStorage', e);
            }

            return uniqueCities;
          })();
        }

        // Esperamos el resultado (sea de localStorage o Firebase)
        const citiesData = await fetchPromise;
        cachedCities = citiesData; // Actualizamos caché en memoria
        setCities(citiesData);
      } catch (error) {
        console.error("Error fetching cities: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return { cities, loading };
}
