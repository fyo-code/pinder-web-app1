'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CreatePetPage() {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'dog'|'cat'|'horse'>('dog');
  const [breed, setBreed] = useState('');
  const [sex, setSex] = useState<'male'|'female'>('male');
  const [ageMonths, setAgeMonths] = useState<number | ''>('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); setMsg('Please sign in first.'); return; }

    let photo_url: string | null = null;
    if (file) {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('pet-photos').upload(path, file);
      if (upErr) { setLoading(false); setMsg(`Upload failed: ${upErr.message}`); return; }
      const { data } = supabase.storage.from('pet-photos').getPublicUrl(path);
      photo_url = data.publicUrl;
    }

    const { error } = await supabase.from('pets').insert({
      user_id: user.id,
      name, species, breed, sex,
      age_months: ageMonths === '' ? null : Number(ageMonths),
      location, bio, photo_url,
    });

    setLoading(false);
    if (error) setMsg(error.message);
    else {
      setMsg('Pet created!');
      setName(''); setBreed(''); setBio(''); setLocation(''); setAgeMonths(''); setFile(null);
    }
  }

  return (
    <main className="container">
      <div className="card centered">
        <h1>Create Pet</h1>

        <form className="stack" onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} required />
          </div>

          <div className="row">
            <div>
              <label>Species</label>
              <select value={species} onChange={e=>setSpecies(e.target.value as any)}>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="horse">Horse</option>
              </select>
            </div>
            <div>
              <label>Sex</label>
              <select value={sex} onChange={e=>setSex(e.target.value as any)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div>
              <label>Breed</label>
              <input value={breed} onChange={e=>setBreed(e.target.value)} />
            </div>
            <div>
              <label>Age (months)</label>
              <input type="number" min={0}
                     value={ageMonths}
                     onChange={e=>setAgeMonths(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
          </div>

          <div className="row">
            <div>
              <label>Location</label>
              <input value={location} onChange={e=>setLocation(e.target.value)} />
            </div>
            <div>
              <label>Photo</label>
              <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
            </div>
          </div>

          <div>
            <label>Short bio</label>
            <textarea rows={3} value={bio} onChange={e=>setBio(e.target.value)} />
          </div>

          <button disabled={loading}>{loading ? 'Saving…' : 'Create Pet'}</button>
        </form>

        {msg && <p style={{marginTop:12}}>{msg}</p>}
      </div>
    </main>
  );
}