'use client';

import { useState } from 'react';
import MovieDetailsModal from './MovieDetailsModal';

interface Props {
  movie: any;
  userId: number;
}

export default function MovieCardActions({ movie, userId }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Le bouton possède maintenant la classe mt-auto et s'aligne parfaitement */}
      <button 
        onClick={() => setIsOpen(true)}
        className="mt-auto w-full py-2.5 px-4 bg-gray-700/50 text-gray-300 font-semibold text-sm text-center rounded-xl hover:bg-red-600 hover:text-white transition-colors border border-gray-600 hover:border-transparent"
      >
        Voir les détails
      </button>

      {/* La modal est rendue en dehors du flux pour ne pas casser le layout Flexbox */}
      {isOpen && (
        <MovieDetailsModal 
          movie={movie} 
          userId={userId}
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  );
}