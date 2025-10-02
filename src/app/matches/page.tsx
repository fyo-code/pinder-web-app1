'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type MatchRow = {
  id: string;
  pet_a: string;
  pet_b: string;
  owner_a: string;
  owner_b: string;
  created_at: string;
};

type Pet = {
  id: string;
  name: string;
  photo_url: string | null;
  breed: string | null;
  species: 'dog'|'cat'|'horse';
  location: string | null;
};

export default function MatchesPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [petsById, setPetsById] = useState<Record<string, Pet>>({});
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setMsg(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setMsg('Please log in.'); setLoading(false); return; }
      setUserId(user.id);

      // 1) fetch my matches
      const { data: ms, error: mErr } = await supabase
        .from('matches')
        .select('*')
        .order('created_at', { ascending: false });
      if (mErr) { setMsg(mErr.message); setLoading(false); return; }

      const myMatches = (ms ?? []).filter(m => m.owner_a === user.id || m.owner_b === user.id) as MatchRow[];
      setMatches(myMatches);

      // 2) fetch details for "the other pet" in each match
      const otherPetIds = Array.from(new Set(
        myMatches.map(m => (m.owner_a === user.id ? m.pet_b : m.pet_a))
      ));

      if (otherPetIds.length > 0) {
        const { data: pets, error: pErr } = await supabase
          .from('pets')
          .select('id, name, photo_url, breed, species, location')
          .in('id', otherPetIds);
        if (pErr) { setMsg(pErr.message); setLoading(false); return; }

        const map: Record<string, Pet> = {};
        for (const p of (pets ?? []) as Pet[]) map[p.id] = p;
        setPetsById(map);
      }

      setLoading(false);
    })();
  }, []);

  const list = useMemo(() => {
    if (!userId) return [];
    return matches.map(m => {
      const otherId = m.owner_a === userId ? m.pet_b : m.pet_a;
      return { matchId: m.id, pet: petsById[otherId] };
    });
  }, [matches, petsById, userId]);

  return (
    <main className="container">
      <div className="card" style={{maxWidth: 680, margin: '0 auto'}}>
        <h1>Matches</h1>
        {loading && <p>Loading…</p>}
        {msg && <p>{msg}</p>}
        {!loading && list.length === 0 && <p>No matches yet. Try swiping!</p>}

        <div style={{display:'grid', gap:12}}>
          {list.map(({ matchId, pet }) => (
            <Link key={matchId} href={`/chat/${matchId}`} style={{textDecoration:'none', color:'inherit'}}>
              <div className="row">
                <div style={{
                  width:56, height:56, borderRadius:12, overflow:'hidden',
                  background:'#eef1f4', flex:'0 0 auto'
                }}>
                  {pet?.photo_url
                    ? <img src={pet.photo_url} alt={pet?.name ?? 'Pet'} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                    : null}
                </div>
                <div style={{flex:1}}>
                  <div className="title-sm">{pet?.name ?? 'Pet'}</div>
                  <div className="muted">{pet?.breed ?? pet?.species}{pet?.location ? ` • ${pet.location}` : ''}</div>
                </div>
                <div className="muted">Chat →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}