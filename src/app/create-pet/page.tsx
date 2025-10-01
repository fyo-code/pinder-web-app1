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
    setMsg(null);
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      setMsg('Please sign in first.');
      return;
    }

    let photo_url: string | null = null;
    if (file) {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('pet-photos')
        .upload(path, file, { upsert: false });
      if (upErr) {
        setLoading(false);
        setMsg(`Upload failed: ${upErr.message}`);
        return;
      }
      const { data } = supabase.storage.from('pet-photos').getPublicUrl(path);
      photo_url = data.publicUrl;
    }

    const { error: insErr } = await supabase.from('pets').insert({
      user_id: user.id,
      name,
      species,
      breed,
      sex,
      age_months: ageMonths === '' ? null : Number(ageMonths),
      location,
      bio,
      photo_url,
    });

    setLoading(false);
    if (insErr) setMsg(insErr.message);
    else {
      setMsg('Pet created! You can go to Swipe next.');
      setName(''); setBreed(''); setBio(''); setLocation(''); setAgeMonths(''); setFile(null);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-xl bg-white p-6 rounded-xl shadow space-y-4">
        <h1 className="text-2xl font-semibold">Create Pet</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full border p-2 rounded" placeholder="Name"
                 value={name} onChange={e=>setName(e.target.value)} required />

          <div className="grid grid-cols-2 gap-3">
            <select className="border p-2 rounded" value={species}
                    onChange={e=>setSpecies(e.target.value as any)}>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="horse">Horse</option>
            </select>

            <select className="border p-2 rounded" value={sex}
                    onChange={e=>setSex(e.target.value as any)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <input className="w-full border p-2 rounded" placeholder="Breed"
                 value={breed} onChange={e=>setBreed(e.target.value)} />

          <input className="w-full border p-2 rounded" placeholder="Age (months)"
                 type="number" min={0}
                 value={ageMonths}
                 onChange={e=>setAgeMonths(e.target.value === '' ? '' : Number(e.target.value))} />

          <input className="w-full border p-2 rounded" placeholder="Location"
                 value={location} onChange={e=>setLocation(e.target.value)} />

          <textarea className="w-full border p-2 rounded" placeholder="Short bio"
                    rows={3} value={bio} onChange={e=>setBio(e.target.value)} />

          <input className="w-full border p-2 rounded bg-white"
                 type="file" accept="image/*"
                 onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />

          <button disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">
            {loading ? 'Saving…' : 'Create Pet'}
          </button>
        </form>

        {msg && <p className="text-sm text-gray-700">{msg}</p>}
      </div>
    </main>
  );
}