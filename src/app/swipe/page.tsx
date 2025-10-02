'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Pet = {
  id: string;
  name: string;
  species: 'dog'|'cat'|'horse';
  breed?: string|null;
  sex?: 'male'|'female'|null;
  age_months?: number|null;
  location?: string|null;
  bio?: string|null;
  photo_url?: string|null;
};

export default function SwipePage() {
  const [mePet, setMePet] = useState<Pet | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [idx, setIdx] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // load my first pet + candidate pets
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setMsg('Please log in first.'); setLoading(false); return; }

      // my pet (first one)
      const { data: myPets, error: myErr } = await supabase
        .from('pets').select('*').eq('user_id', user.id).limit(1);
      if (myErr) { setMsg(myErr.message); setLoading(false); return; }
      if (!myPets || myPets.length === 0) {
        setMsg('Create your pet profile first.'); setLoading(false); return;
      }
      setMePet(myPets[0] as Pet);

      // candidate pets (not mine). You can add location filter later.
      const { data: candidates, error: candErr } = await supabase
        .from('pets')
        .select('*')
        .neq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      if (candErr) { setMsg(candErr.message); setLoading(false); return; }
      setPets((candidates ?? []) as Pet[]);
      setIdx(0);
      setLoading(false);
    })();
  }, []);

  async function vote(decision: 'like'|'dislike') {
    if (!mePet) { setMsg('No local pet.'); return; }
    const current = pets[idx];
    if (!current) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMsg('Please log in first.'); return; }

    const { error } = await supabase.from('likes').insert({
      liker_user_id: user.id,
      liker_pet_id: mePet.id,
      liked_pet_id: current.id,
      decision
    });
    if (error) { setMsg(error.message); return; }

    setIdx(i => i + 1);
  }

  const card = pets[idx];

  return (
    <main className="container">
      <div className="card centered">
        <h1>Swiping</h1>

        {loading && <p>Loading…</p>}
        {!loading && !card && <p>No more nearby pets right now. Check back soon!</p>}

        {!loading && card && (
          <div className="stack">
            <div>
              <div style={{
                borderRadius: 16, overflow: 'hidden',
                width: '100%', maxWidth: 520, aspectRatio: '1 / 1',
                background: '#eef1f4', margin: '0 auto'
              }}>
                {card.photo_url
                  ? <img src={card.photo_url} alt={card.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                  : <div style={{display:'grid',placeItems:'center',height:'100%',color:'#6b7280'}}>No photo</div>}
              </div>
            </div>

            <div>
              <h2 style={{marginBottom:8}}>
                {card.name}{card.age_months != null ? `, ${Math.floor(card.age_months/12)}` : ''}
              </h2>
              <p style={{margin:'4px 0', color:'#6b7280'}}>
                {card.breed ?? card.species}{card.location ? ` • ${card.location}` : ''}
              </p>
              {card.bio && <p style={{marginTop:8}}>{card.bio}</p>}
            </div>

            <div style={{display:'flex', gap:12}}>
              <button onClick={()=>vote('dislike')} style={{background:'#e5e7eb', color:'#111827'}}>Dislike</button>
              <button onClick={()=>vote('like')}>Like</button>
            </div>
          </div>
        )}

        {msg && <p style={{marginTop:12}}>{msg}</p>}
      </div>
    </main>
  );
}