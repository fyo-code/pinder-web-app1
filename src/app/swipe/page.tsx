'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Species = 'dog' | 'cat' | 'horse';
type Sex = 'male' | 'female';

interface Pet {
  id: string;
  name: string;
  species: Species;
  breed?: string;
  sex?: Sex;
  age_months?: number;
  location?: string;
  bio?: string;
  photo_url?: string;
}

export default function SwipePage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [idx, setIdx] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [msg, setMsg] = useState<string | null>(null);

  // drag state
  const startX = useRef<number | null>(null);
  const deltaX = useRef<number>(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setMsg(null);
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(25);

      if (error) setMsg(error.message);
      else setPets((data ?? []) as Pet[]);
      setLoading(false);
    })();
  }, []);

  const active = pets[idx];

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    startX.current = e.touches[0]?.clientX ?? null;
    deltaX.current = 0;
  }

  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    if (startX.current == null) return;
    deltaX.current = (e.touches[0]?.clientX ?? 0) - startX.current;
  }

  function handleTouchEnd() {
    const dx = deltaX.current;
    startX.current = null;
    deltaX.current = 0;
    if (Math.abs(dx) < 60) return; // ignore small drags
    setIdx((i) => Math.min(i + 1, pets.length));
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </main>
    );
  }

  if (!active) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No more pets. Come back later!</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-end justify-center p-6">
      <div className="w-full max-w-md">
        <div
          className="relative h-[520px] w-full select-none overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-100"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* image */}
          {active.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={active.photo_url}
              alt={active.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-pink-100 to-pink-50" />
          )}

          {/* name strip */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
            <p className="text-white text-xl font-semibold">
              {active.name}
              {typeof active.age_months === 'number'
                ? `, ${Math.round(active.age_months / 12)}`
                : ''}
            </p>
            <p className="text-white/80 text-sm">
              {active.breed ?? active.species}
            </p>
          </div>
        </div>

        {/* actions */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setIdx((i) => Math.min(i + 1, pets.length))}
            className="flex-1 rounded-xl border border-gray-200 bg-white py-3 font-medium text-gray-700 shadow-sm"
          >
            ✖ Dislike
          </button>
          <button
            onClick={() => setIdx((i) => Math.min(i + 1, pets.length))}
            className="flex-1 rounded-xl bg-pink-600 py-3 font-medium text-white shadow-sm hover:bg-pink-700"
          >
            ❤ Like
          </button>
        </div>

        {msg && <p className="mt-3 text-center text-sm text-gray-700">{msg}</p>}
      </div>
    </main>
  );
}