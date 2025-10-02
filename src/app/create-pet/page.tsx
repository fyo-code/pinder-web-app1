'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Species = 'dog'|'cat'|'horse'
type Sex = 'male'|'female'

export default function CreatePetPage() {
  const [name, setName] = useState('')
  const [species, setSpecies] = useState<Species>('dog')
  const [breed, setBreed] = useState('')
  const [sex, setSex] = useState<Sex>('male')
  const [ageMonths, setAgeMonths] = useState<number | ''>('')
  const [location, setLocation] = useState('')
  const [bio, setBio] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null); setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      setMsg('Please sign in first.')
      return
    }

    let photo_url: string | null = null
    if (file) {
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`
      const { error: upErr } = await supabase.storage.from('pet-photos').upload(path, file, { upsert: false })
      if (upErr) {
        setLoading(false)
        setMsg(`Upload failed: ${upErr.message}`)
        return
      }
      const { data } = supabase.storage.from('pet-photos').getPublicUrl(path)
      photo_url = data.publicUrl
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
    })

    setLoading(false)
    if (insErr) setMsg(insErr.message)
    else {
      setMsg('Pet created.')
      setName(''); setBreed(''); setBio(''); setLocation(''); setAgeMonths(''); setFile(null)
    }
  }

  return (
    <main>
      <h1>Create Pet</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />

        <select value={species} onChange={(e)=>setSpecies(e.target.value as Species)}>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="horse">Horse</option>
        </select>

        <select value={sex} onChange={(e)=>setSex(e.target.value as Sex)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input placeholder="Breed" value={breed} onChange={e=>setBreed(e.target.value)} />
        <input
          placeholder="Age (months)"
          type="number"
          min={0}
          value={ageMonths}
          onChange={e=>setAgeMonths(e.target.value === '' ? '' : Number(e.target.value))}
        />
        <input placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} />
        <textarea placeholder="Short bio" rows={3} value={bio} onChange={e=>setBio(e.target.value)} />

        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] ?? null)} />

        <button disabled={loading}>{loading ? 'Saving…' : 'Create Pet'}</button>
      </form>

      {msg && <p>{msg}</p>}
    </main>
  )
}