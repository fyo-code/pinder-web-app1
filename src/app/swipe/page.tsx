'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'horse';
  breed?: string;
  sex?: 'male' | 'female';
  age_months?: number;
  location?: string;
  bio?: string;
  photo_url?: string;
}

export default function SwipePage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  // card drag state
  const startX = useRef<number | null>(null);
  const [offsetX, setOffsetX] = useState(0);

  useEffect(() => {
    async function loadPets() {
      const { data, error } = await supabase.from('pets').select('*');
      if (error) setMsg(error.message);
      else setPets(data as Pet[]);
      setLoading(false);
    }
    loadPets();
  }, []);

  function handleTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX;
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (startX.current !== null) {
      setOffsetX(e.touches[0].clientX - startX.current);
    }
  }

  function handleTouchEnd() {
    if (offsetX > 100) {
      // swiped right
      setIdx((prev) => prev + 1);
    } else if (offsetX < -100) {
      // swiped left
      setIdx((prev) => prev + 1);
    }
    setOffsetX(0);
    startX.current = null;
  }

  if (loading) return <p className="p-6">Loading…</p>;
  if (idx >= pets.length) return <p className="p-6">No more pets!</p>;

  const pet = pets[idx];

  return (
    <main className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div
        className="w-80 bg-white p-4 rounded-xl shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateX(${offsetX}px)` }}
      >
        {pet.photo_url && (
          <img
            src={pet.photo_url}
            alt={pet.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}
        <h2 className="text-xl font-semibold mt-3">{pet.name}</h2>
        <p className="text-sm text-gray-600">{pet.species} • {pet.sex}</p>
        {pet.age_months !== undefined && (
          <p className="text-sm text-gray-600">{pet.age_months} months old</p>
        )}
        {pet.bio && <p className="mt-2 text-sm">{pet.bio}</p>}
      </div>

      {msg && <p className="absolute bottom-4 text-red-600">{msg}</p>}
    </main>
  );
}