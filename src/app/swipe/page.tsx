'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Pet = {
  id: string;
  user_id: string;
  name: string;
  species: 'dog'|'cat'|'horse';
  breed?: string | null;
  sex?: 'male'|'female' | null;
  age_months?: number | null;
  location?: string | null;
  bio?: string | null;
  photo_url?: string | null;
};

export default function SwipePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [mePet, setMePet] = useState<Pet | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [idx, setIdx] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const current = useMemo(() => pets[idx] ?? null, [pets, idx]);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setMsg(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setMsg('Please log in first.'); setLoading(false); return; }
      setUserId(user.id);

      // my latest pet
      const { data: myPets, error: meErr } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (meErr) { setMsg(meErr.message); setLoading(false); return; }
      const mine = (myPets ?? [])[0] as Pet | undefined;
      if (!mine) { setMsg('Create your pet profile first.'); setLoading(false); return; }
      setMePet(mine);

      // pets I already judged
      const { data: seenRows, error: seenErr } = await supabase
        .from('likes')
        .select('liked_pet_id')
        .eq('liker_user_id', user.id)
        .eq('liker_pet_id', mine.id);

      if (seenErr) { setMsg(seenErr.message); setLoading(false); return; }
      const seenIds = new Set<string>((seenRows ?? []).map((r: any) => r.liked_pet_id as string));

      // candidate pets (not mine)
      const { data: candidates, error: candErr } = await supabase
        .from('pets')
        .select('*')
        .neq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (candErr) { setMsg(candErr.message); setLoading(false); return; }

      const filtered = (candidates ?? []).filter((p: any) => !seenIds.has(p.id));
      setPets(filtered as Pet[]);
      setIdx(0);
      setLoading(false);
    })();
  }, []);

  async function recordSwipe(target: Pet, liked: boolean) {
    if (!userId || !mePet) return;

    const { error: likeErr } = await supabase.from('likes').insert({
      liker_user_id: userId,
      liker_pet_id: mePet.id,
      liked_pet_id: target.id,
      liked,
    });
    if (likeErr) { setMsg(likeErr.message); return; }

    // create match on mutual like
    if (liked) {
      const { data: back, error: backErr } = await supabase
        .from('likes')
        .select('id')
        .eq('liker_pet_id', target.id)
        .eq('liked_pet_id', mePet.id)
        .eq('liked', true)
        .limit(1);

      if (!backErr && (back ?? []).length > 0) {
        await supabase.from('matches').insert({
          pet_a: mePet.id,
          pet_b: target.id,
          owner_a: userId,
          owner_b: target.user_id
        });
      }
    }

    setIdx(i => Math.min(i + 1, pets.length));
  }

  return (
    <main className="container" style={{maxWidth: 880, margin: '0 auto', padding: 16}}>
      {/* Top nav links */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
        <Link href="/matches">Matches</Link>
        <div style={{display:'flex', gap:16}}>
          <Link href="/create-pet">Create Pet</Link>
          <Link href="/login">Login</Link>
        </div>
      </div>

      <div className="card" style={{maxWidth: 760, margin: '0 auto'}}>
        <h1>Swiping</h1>

        {loading && <p>Loading…</p>}
        {msg && <p>{msg}</p>}
        {!loading && !current && <p>No more nearby pets for now. Check back later!</p>}

        {current && (
          <div ref={cardRef} style={{marginTop: 12}}>
            <div style={{
              width:'100%', aspectRatio:'4/5', borderRadius:16, overflow:'hidden',
              background:'#eef1f4', marginBottom:12
            }}>
              {current.photo_url
                ? <img src={current.photo_url} alt={current.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                : null}
            </div>

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <div className="title-sm">
                  {current.name}{typeof current.age_months==='number' ? `, ${Math.floor(current.age_months/12)}` : ''}
                </div>
                <div className="muted">
                  {current.breed ?? current.species}
                  {current.location ? ` • ${current.location}` : ''}
                </div>
              </div>

              <div style={{display:'flex', gap:8}}>
                <button className="secondary" onClick={()=>recordSwipe(current, false)}>Dislike</button>
                <button onClick={()=>recordSwipe(current, true)}>Like</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}