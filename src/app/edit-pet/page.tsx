'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Pet = {
  id: string;
  name: string;
  species: 'dog'|'cat'|'horse';
  breed: string | null;
  sex: 'male'|'female' | null;
  age_months: number | null;
  location: string | null;
  bio: string | null;
  photo_url: string | null;
};

export default function EditPetPage() {
  const [pet, setPet] = useState<Pet | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setMsg('Please log in.'); return; }
      const { data, error } = await supabase
        .from('pets').select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (error) { setMsg(error.message); return; }
      setPet(data as Pet);
    })();
  }, []);

  async function save() {
    if (!pet) return;
    setSaving(true); setMsg(null);
    const { id, ...fields } = pet;
    const { error } = await supabase.from('pets').update(fields).eq('id', id);
    setSaving(false);
    if (error) setMsg(error.message);
    else setMsg('Saved!');
  }

  async function del() {
    if (!pet) return;
    if (!confirm('Delete this pet?')) return;
    const { error } = await supabase.from('pets').delete().eq('id', pet.id);
    if (error) setMsg(error.message);
    else { setMsg('Deleted. Create a new pet.'); setPet(null); }
  }

  if (!pet) return <main className="container"><p>{msg ?? 'Loading…'}</p></main>;

  return (
    <main className="container" style={{maxWidth:640, margin:'0 auto'}}>
      <h1>Edit Pet</h1>
      {msg && <p>{msg}</p>}
      <div style={{display:'grid', gap:8, marginTop:12}}>
        <input value={pet.name} onChange={e=>setPet({...pet, name:e.target.value})} placeholder="Name"/>
        <select value={pet.species} onChange={e=>setPet({...pet, species: e.target.value as Pet['species']})}>
          <option value="dog">Dog</option><option value="cat">Cat</option><option value="horse">Horse</option>
        </select>
        <select value={pet.sex ?? 'male'} onChange={e=>setPet({...pet, sex: e.target.value as 'male'|'female'})}>
          <option value="male">Male</option><option value="female">Female</option>
        </select>
        <input type="number" min={0} value={pet.age_months ?? 0}
               onChange={e=>setPet({...pet, age_months: Number(e.target.value)})} placeholder="Age (months)"/>
        <input value={pet.location ?? ''} onChange={e=>setPet({...pet, location:e.target.value})} placeholder="City"/>
        <textarea rows={3} value={pet.bio ?? ''} onChange={e=>setPet({...pet, bio:e.target.value})} placeholder="Bio"/>
      </div>
      <div style={{display:'flex', gap:8, marginTop:12}}>
        <button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        <button onClick={del} className="secondary">Delete</button>
      </div>
    </main>
  );
}