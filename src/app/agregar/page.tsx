import AddRecordForm from '../components/AddRecordForm';
import Link from 'next/link';

export default function AgregarPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
       {/* Minimalist Ecuador Accent */}
       <div className="absolute top-0 left-0 w-full h-1.5 flex">
            <div className="w-1/2 bg-yellow-400"></div>
            <div className="w-1/4 bg-blue-700"></div>
            <div className="w-1/4 bg-red-600"></div>
        </div>

      <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light tracking-tight text-slate-900">
            Reportar <span className="font-bold">Fiel</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 font-light">
            Formulario para añadir nuevas personas al Registro Nacional De Fieles.
          </p>
          <div className="mt-8">
            <Link href="/" className="text-blue-900 hover:text-blue-700 font-medium transition-colors">
              &larr; Volver a la consulta
            </Link>
          </div>
        </div>
        
        <AddRecordForm />
      </div>
    </div>
  );
}
