import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface City {
  id: string;
  name: string;
  province: string;
}

export function useCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesRef = collection(db, 'cities');
        const q = query(citiesRef, orderBy('name'));
        const querySnapshot = await getDocs(q);
        const citiesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as City));
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
