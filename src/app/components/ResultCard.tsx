'use client';

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Timestamp } from 'firebase/firestore';

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

interface ResultCardProps {
  result: Result;
  cityName: string;
}

export default function ResultCard({ result, cityName }: ResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  const formatDate = (date: Timestamp | Date | undefined) => {
    if (!date) return 'Fecha desconocida';
    const d = date instanceof Timestamp ? date.toDate() : date;
    return d.toLocaleDateString('es-EC', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    setSharing(true);

    try {
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true, 
        backgroundColor: '#ffffff',
        skipAutoScale: true,
        pixelRatio: 2 // Ensure high quality
      });
      
      // Convert Data URL to Blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();

      // Check if Web Share API is supported and can share files
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'fiel.png', { type: 'image/png' })] })) {
        const file = new File([blob], 'registro-fiel.png', { type: 'image/png' });
        await navigator.share({
          title: 'Registro Nacional de Fieles',
          text: `¡Encontré a ${result.first_name} ${result.last_name} en el Registro Nacional de Fieles!`,
          files: [file]
        });
      } else {
        // Fallback: Download the image
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `fiel-${result.first_name}-${result.last_name}.png`;
        link.click();
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('No se pudo compartir la imagen. Intenta descargarla manualmente.');
    } finally {
      setSharing(false);
    }
  };

  const genderImage = result.gender === 'Femenino' ? '/her.png' : result.gender === 'Masculino' ? '/him.png' : null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Content to capture */}
      <div ref={cardRef} className="p-4 rounded-lg relative" style={{ backgroundColor: '#ffffff' }}> 
        
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            {genderImage && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img 
                src={genderImage} 
                alt="Avatar" 
                crossOrigin="anonymous"
                className="w-16 h-16 object-cover rounded-full"
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
              />
            )}
            <div>
              <h4 className="font-bold text-xl uppercase tracking-wide" style={{ color: '#111827' }}>
                {result.first_name} {result.last_name}
              </h4>
              <span className="text-xs font-medium px-3 py-1 rounded-full inline-block mt-1" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
                Fiel Verificado
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mb-4 text-sm" style={{ color: '#374151' }}>
          <div className="flex flex-wrap gap-x-4">
            <p><span className="font-bold" style={{ color: '#111827' }}>Edad:</span> {result.age || 'N/A'}</p>
            <p><span className="font-bold" style={{ color: '#111827' }}>Ciudad:</span> {cityName}</p>
            {result.gender && <p><span className="font-bold" style={{ color: '#111827' }}>Género:</span> {result.gender}</p>}
          </div>
          <p><span className="font-bold" style={{ color: '#111827' }}>Fecha registro:</span> {formatDate(result.created_at)}</p>
        </div>

        <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
          <p className="text-sm leading-relaxed italic" style={{ color: '#4b5563' }}>
            &quot;{result.description}&quot;
          </p>
        </div>
        
        {/* Watermark for the image (visible only in capture if we wanted, but here it's always visible inside the ref) */}
        <div className="text-center mt-2">
           <p className="text-xs" style={{ color: '#9ca3af' }}>Registro Nacional De Fieles - Ecuador</p>
        </div>
      </div>

      {/* Action Buttons (Outside the capture ref) */}
      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end">
        <button
          onClick={handleShare}
          disabled={sharing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
        >
          {sharing ? (
            <span>Generando...</span>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              Compartir
            </>
          )}
        </button>
      </div>
    </div>
  );
}
