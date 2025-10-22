'use client'
import { useState } from 'react'

type PetFormValues = {
  name: string; species: 'dog'|'cat'|'horse'; sex: 'male'|'female';
  breed?: string; age_months?: number; location?: string; bio?: string;
  file?: File|null;
}

export default function PetForm({ onSubmit, initial }: {
  initial?: Partial<PetFormValues>,
  onSubmit: (v: PetFormValues)=>void
}) {
  const [v, setV] = useState<PetFormValues>({
    name: initial?.name ?? '',
    species: (initial?.species as any) ?? 'dog',
    sex: (initial?.sex as any) ?? 'male',
    breed: initial?.breed ?? '',
    age_months: initial?.age_months ?? 0,
    location: initial?.location ?? '',
    bio: initial?.bio ?? '',
    file: null,
  })

  return (
    <form onSubmit={e=>{e.preventDefault(); onSubmit(v)}} className="space-y-3">
      {/* TODO: replace with a pretty form snippet; keep onChange handlers */}
      <input className="w-full rounded-lg border px-3 py-2" placeholder="Name"
             value={v.name} onChange={e=>setV({...v, name:e.target.value})} />
      <div className="grid grid-cols-2 gap-2">
        <select className="rounded-lg border px-3 py-2" value={v.species} onChange={e=>setV({...v, species: e.target.value as any})}>
          <option value="dog">Dog</option><option value="cat">Cat</option><option value="horse">Horse</option>
        </select>
        <select className="rounded-lg border px-3 py-2" value={v.sex} onChange={e=>setV({...v, sex: e.target.value as any})}>
          <option value="male">Male</option><option value="female">Female</option>
        </select>
      </div>
      <input className="w-full rounded-lg border px-3 py-2" placeholder="Breed"
             value={v.breed} onChange={e=>setV({...v, breed:e.target.value})} />
      <input className="w-full rounded-lg border px-3 py-2" type="number" min={0} placeholder="Age (months)"
             value={v.age_months} onChange={e=>setV({...v, age_months: Number(e.target.value)})} />
      <input className="w-full rounded-lg border px-3 py-2" placeholder="City"
             value={v.location} onChange={e=>setV({...v, location:e.target.value})} />
      <textarea className="w-full rounded-lg border px-3 py-2" rows={3} placeholder="Short bio"
                value={v.bio} onChange={e=>setV({...v, bio:e.target.value})} />
      <input type="file" accept="image/*" onChange={e=>setV({...v, file: e.target.files?.[0] ?? null})} />
      <button className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white">Save</button>
    </form>
  )
}