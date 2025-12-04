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
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    edad: '',
    genero: '',
    ciudad: '',
    descripcion: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'registros'), {
        first_name: formData.nombres,
        last_name: formData.apellidos,
        age: Number(formData.edad),
        gender: formData.genero,
        city_id: formData.ciudad,
        description: formData.descripcion,
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
            {cities.map((c) => (
              <option key={c.id} value={c.id} className="text-slate-900">
                {c.name}
              </option>
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
