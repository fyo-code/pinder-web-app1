'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Match = {
  id: string;
  pet_a: string;
  pet_b: string;
  owner_a: string;
  owner_b: string;
  created_at: string;
};

type Pet = {
  id: string;
  name: string | null;
  photo_url: string | null;
};

export default function MatchesPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [petsById, setPetsById] = useState<Record<string, Pet>>({});
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const petIdsNeeded = useMemo(() => {
    const ids = new Set<string>();
    for (const m of matches) {
      ids.add(m.pet_a);
      ids.add(m.pet_b);
    }
    return Array.from(ids);
  }, [matches]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setMsg(null);

      const { data: { user }, error: uErr } = await supabase.auth.getUser();
      if (uErr) { setMsg(uErr.message); setLoading(false); return; }
      if (!user) { setMsg('Please log in first.'); setLoading(false); return; }

      setUserId(user.id);

      // fetch my matches (I am owner_a or owner_b)
      const { data: rows, error } = await supabase
        .from('matches')
        .select('id, pet_a, pet_b, owner_a, owner_b, created_at')
        .or(`owner_a.eq.${user.id},owner_b.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) { setMsg(error.message); setLoading(false); return; }
      setMatches((rows ?? []) as Match[]);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (petIdsNeeded.length === 0) return;
      const { data, error } = await supabase
        .from('pets')
        .select('id, name, photo_url')
        .in('id', petIdsNeeded);

      if (!error && data) {
        const map: Record<string, Pet> = {};
        for (const p of data as Pet[]) map[p.id] = p;
        setPetsById(map);
      }
    })();
  }, [petIdsNeeded.join('|')]); // cheap dep

  if (loading) return <main style={{padding:16}}><p>Loading…</p></main>;
  if (msg)      return <main style={{padding:16}}><p>{msg}</p></main>;
  if (!userId)  return <main style={{padding:16}}><p>Please log in.</p></main>;

  return (
    <main style={{padding:16}}>
      <h1 style={{marginBottom:12}}>Your Matches</h1>

      {matches.length === 0 && <p>No matches yet. Try swiping ✨</p>}

      <ul style={{listStyle:'none', padding:0, margin:0, display:'grid', gap:12}}>
        {matches.map(m => {
          const myPetId = m.owner_a === userId ? m.pet_a : m.pet_b;
          const otherPetId = m.owner_a === userId ? m.pet_b : m.pet_a;

          const mine = petsById[myPetId];
          const other = petsById[otherPetId];

          return (
            <li key={m.id} style={{
              border:'1px solid #e5e7eb', borderRadius:12, padding:12, display:'flex',
              alignItems:'center', justifyContent:'space-between', gap:12
            }}>
              <div style={{display:'flex', alignItems:'center', gap:12}}>
                {other?.photo_url ? (
                  <img src={other.photo_url} alt={other?.name ?? 'Pet'}
                       style={{width:48, height:48, borderRadius:8, objectFit:'cover'}} />
                ) : <div style={{width:48,height:48,background:'#f3f4f6',borderRadius:8}} />}
                <div>
                  <div style={{fontWeight:600}}>
                    {other?.name ?? 'Unknown pet'}
                  </div>
                  <div style={{fontSize:12, color:'#6b7280'}}>Match ID: {m.id.slice(0,8)}…</div>
                </div>
              </div>

              <Link href={`/chat/${m.id}`} style={{
                textDecoration:'none', background:'#111827', color:'white',
                padding:'8px 12px', borderRadius:8
              }}>
                Open chat →
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}