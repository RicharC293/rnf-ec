'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import { useCities } from '../../hooks/useCities';

export default function AddRecordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { cities, loading: loadingCities } = useCities();

  // Agrupar ciudades por provincia
  const citiesByProvince = cities.reduce((acc, city) => {
    if (!acc[city.province]) {
      acc[city.province] = [];
    }
    acc[city.province].push(city);
    return acc;
  }, {} as Record<string, typeof cities>);

  const sortedProvinces = Object.keys(citiesByProvince).sort();

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    edad: '',
    genero: '',
    ciudad: '',
    descripcion: '',
    acceptedTerms: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'registros'), {
        first_name: formData.nombres,
        last_name: formData.apellidos,
        // Campo optimizado para búsquedas (lowercase)
        search_name: `${formData.nombres} ${formData.apellidos}`.toLowerCase(),
        age: Number(formData.edad),
        gender: formData.genero,
        city_id: formData.ciudad,
        description: formData.descripcion,
        accepted_terms: formData.acceptedTerms,
        created_at: new Date()
      });
      
      alert('Registro agregado exitosamente');
      router.push('/'); // Redirigir al inicio
    } catch (error) {
      console.error('Error al agregar el registro: ', error);
      alert('Hubo un error al guardar el registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="nombres" className="block text-sm font-medium text-slate-700 mb-1">Nombres</label>
          <input
            type="text"
            name="nombres"
            id="nombres"
            required
            className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-300 focus:ring-blue-100 sm:text-sm border p-3 text-slate-900 placeholder:text-slate-400 transition-all outline-none focus:ring-2"
            value={formData.nombres}
            onChange={handleChange}
            placeholder="Ej: Juan"
          />
        </div>

        <div>
          <label htmlFor="apellidos" className="block text-sm font-medium text-slate-700 mb-1">Apellidos</label>
          <input
            type="text"
            name="apellidos"
            id="apellidos"
            required
            className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-300 focus:ring-blue-100 sm:text-sm border p-3 text-slate-900 placeholder:text-slate-400 transition-all outline-none focus:ring-2"
            value={formData.apellidos}
            onChange={handleChange}
            placeholder="Ej: Pérez"
          />
        </div>

        <div>
          <label htmlFor="edad" className="block text-sm font-medium text-slate-700 mb-1">Edad</label>
          <input
            type="number"
            name="edad"
            id="edad"
            required
            className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-300 focus:ring-blue-100 sm:text-sm border p-3 text-slate-900 placeholder:text-slate-400 transition-all outline-none focus:ring-2"
            value={formData.edad}
            onChange={handleChange}
            placeholder="Ej: 25"
          />
        </div>

        <div>
          <label htmlFor="genero" className="block text-sm font-medium text-slate-700 mb-1">Género</label>
          <select
            name="genero"
            id="genero"
            required
            className={`block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-300 focus:ring-blue-100 sm:text-sm border p-3 transition-all outline-none focus:ring-2 ${formData.genero === '' ? 'text-slate-400' : 'text-slate-900'}`}
            value={formData.genero}
            onChange={handleChange}
          >
            <option value="" className="text-slate-400">Seleccione...</option>
            <option value="Masculino" className="text-slate-900">Masculino</option>
            <option value="Femenino" className="text-slate-900">Femenino</option>
            <option value="Otro" className="text-slate-900">Otro</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="ciudad" className="block text-sm font-medium text-slate-700 mb-1">Ciudad</label>
          <select
            name="ciudad"
            id="ciudad"
            required
            className={`block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-300 focus:ring-blue-100 sm:text-sm border p-3 bg-white transition-all outline-none focus:ring-2 ${formData.ciudad === '' ? 'text-slate-400' : 'text-slate-900'}`}
            value={formData.ciudad}
            onChange={handleChange}
            disabled={loadingCities}
          >
            <option value="" className="text-slate-400">Seleccione una ciudad...</option>
            {sortedProvinces.map((province) => (
              <optgroup key={province} label={province} className="text-slate-900 font-bold">
                {citiesByProvince[province].map((c) => (
                  <option key={c.id} value={c.id} className="text-slate-900 font-normal">
                    {c.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-slate-700 mb-1">Describe por qué es fiel</label>
        <textarea
          name="descripcion"
          id="descripcion"
          rows={4}
          required
          className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-300 focus:ring-blue-100 sm:text-sm border p-3 text-slate-900 placeholder:text-slate-400 transition-all outline-none focus:ring-2"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Detalla las cualidades de fidelidad..."
        />
      </div>

      <div className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-center h-5">
          <input
            id="acceptedTerms"
            name="acceptedTerms"
            type="checkbox"
            required
            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer"
            checked={formData.acceptedTerms}
            onChange={handleChange}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="acceptedTerms" className="font-medium text-slate-900 cursor-pointer select-none">
            Confirmo que la información es real y acepto compartirla de forma <span className="font-bold text-blue-700">anónima</span>.
          </label>
          
          <div className="mt-1 relative inline-block group">
            <span className="text-blue-600 text-xs cursor-help border-b border-blue-400 border-dashed hover:text-blue-800 transition-colors flex items-center gap-1 w-fit">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
              ¿Cómo protegemos tu identidad?
            </span>
            
            {/* Tooltip */}
            <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 absolute bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-2 w-72 p-4 bg-slate-800 text-white text-xs rounded-xl shadow-xl z-50 leading-relaxed pointer-events-none">
              <p className="font-bold mb-2 text-blue-200">Tu seguridad es nuestra prioridad:</p>
              <ul className="list-disc pl-4 space-y-1 text-slate-300">
                <li>Este reporte es <strong>100% anónimo</strong>.</li>
                <li>No guardamos tu ubicación ni datos personales.</li>
                <li>Usamos <strong>Inteligencia Artificial</strong> para filtrar contenido ofensivo y proteger la integridad de la comunidad.</li>
              </ul>
              {/* Arrow */}
              <div className="absolute top-full left-6 sm:left-1/2 sm:-translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
        >
          {loading ? 'Guardando...' : 'Guardar Registro'}
        </button>
      </div>
    </form>
  );
}
