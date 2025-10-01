'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Pet = {
  id: string;
  name: string;
  species: 'dog'|'cat'|'horse';
  breed: string | null;
  sex: 'male'|'female';
  age_months: number | null;
  location: string | null;
  bio: string | null;
  photo_url: string | null;
  user_id: string;
};

export default function SwipePage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  // card drag state
  const startX = useRef<number | null>(null);
  const deltaX = useRef(0);
  const [drag, setDrag] = useState(0);

  const current = pets[idx];
  const leftCount = useMemo(() => Math.max(pets.length - idx - 1, 0), [pets, idx]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setMsg(null);

      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) {
        setLoading(false);
        setMsg('Please sign in first (go to Login).');
        return;
      }

      // Load candidates not owned by me and not already swiped
      const { data: swiped } = await supabase
        .from('swipes')
        .select('pet_id')
        .eq('swiper_id', user.id);

      const exclude = new Set((swiped ?? []).map((s: any) => s.pet_id));

      const { data: petsRes, error } = await supabase
        .from('pets')
        .select('*')
        .neq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        setMsg(error.message); setLoading(false); return;
      }

      const filtered = (petsRes ?? []).filter(p => !exclude.has(p.id));
      setPets(filtered);
      setIdx(0);
      setLoading(false);
    })();
  }, []);

  async function decide(value: 'like'|'nope') {
    if (!current) return;
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) { setMsg('Please sign in first.'); return; }

    // save decision
    await supabase.from('swipes').insert({
      swiper_id: user.id,
      pet_id: current.id,
      value
    });

    // advance stack
    setIdx(i => Math.min(i + 1, pets.length));
    setDrag(0);
    deltaX.current = 0;
    startX.current = null;
  }

  // Pointer (mouse/touch) handlers for swipe
  function onPointerDown(e: React.PointerEvent) {
    startX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (startX.current === null) return;
    deltaX.current = e.clientX - startX.current;
    setDrag(deltaX.current);
  }
  function onPointerUp() {
    const dx = deltaX.current;
    const threshold = 120;
    if (Math.abs(dx) > threshold) {
      decide(dx > 0 ? 'like' : 'nope');
    } else {
      setDrag(0);
    }
    startX.current = null;
    deltaX.current = 0;
  }

  if (loading) {
    return <main className="min-h-screen bg-zinc-100 p-6 flex items-center justify-center">
      <div className="text-zinc-700">Loading…</div>
    </main>;
  }

  if (!current) {
    return <main className="min-h-screen bg-zinc-100 p-6 flex items-center justify-center">
      <div className="bg-white border border-zinc-200 rounded-2xl shadow p-6 text-center">
        <div className="text-xl font-semibold text-zinc-900">No more pets</div>
        <p className="text-zinc-600 mt-1">Check back later.</p>
      </div>
    </main>;
  }

  return (
    <main className="min-h-screen bg-zinc-100 p-6">
      <div className="mx-auto max-w-md relative" style={{ height: 560 }}>
        {/* stack info */}
        <div className="absolute -top-6 left-0 text-sm text-zinc-600">{leftCount} left</div>

        {/* card */}
        <div
          className="absolute inset-0 bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden select-none"
          style={{
            transform: `translateX(${drag}px) rotate(${drag * 0.05}deg)`,
            transition: startX.current ? 'none' : 'transform 180ms ease'
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {current.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={current.name}
              src={current.photo_url}
              className="w-full h-72 object-cover"
            />
          ) : (
            <div className="w-full h-72 bg-zinc-200" />
          )}

          <div className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-zinc-900">
                {current.name}
              </h2>
              <span className="text-sm px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700">
                {current.species}
              </span>
            </div>
            <div className="text-zinc-700">
              {current.breed || 'Unknown breed'} • {current.sex}
              {typeof current.age_months === 'number' ? ` • ${current.age_months}m` : ''}
            </div>
            {current.location && (
              <div className="text-zinc-600">{current.location}</div>
            )}
            {current.bio && (
              <p className="text-zinc-700 mt-2">{current.bio}</p>
            )}
          </div>
        </div>

        {/* actions */}
        <div className="absolute -bottom-4 left-0 right-0 flex items-center justify-center gap-4">
          <button
            onClick={() => decide('nope')}
            className="h-12 w-12 rounded-full border border-zinc-300 bg-white text-zinc-900 shadow hover:bg-zinc-50"
            aria-label="Nope"
            title="Nope"
          >
            ✖
          </button>
          <button
            onClick={() => decide('like')}
            className="h-12 w-12 rounded-full border border-blue-600 bg-blue-600 text-white shadow hover:bg-blue-700"
            aria-label="Like"
            title="Like"
          >
            ❤
          </button>
        </div>
      </div>

      {msg && <p className="mt-4 text-center text-sm text-zinc-700">{msg}</p>}
    </main>
  );
}