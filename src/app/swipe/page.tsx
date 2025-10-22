'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Pet = {
  id: string
  user_id: string
  name: string
  species: 'dog'|'cat'|'horse'
  breed?: string | null
  sex?: 'male'|'female' | null
  age_months?: number | null
  location?: string | null
  bio?: string | null
  photo_url?: string | null
}

export default function SwipePage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [mePet, setMePet] = useState<Pet | null>(null)
  const [pets, setPets] = useState<Pet[]>([])
  const [idx, setIdx] = useState(0)
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const current = useMemo(() => pets[idx] ?? null, [pets, idx])
  const cardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    (async () => {
      setLoading(true)
      setMsg(null)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setMsg('Please log in first.'); setLoading(false); return }
      setUserId(user.id)

      // my latest pet
      const { data: myPets, error: meErr } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
      if (meErr) { setMsg(meErr.message); setLoading(false); return }
      const mine = (myPets ?? [])[0] as Pet | undefined
      if (!mine) { setMsg('Create your pet profile first.'); setLoading(false); return }
      setMePet(mine)

      // ids I already judged
      const { data: seenRows, error: seenErr } = await supabase
        .from('likes')
        .select('liked_pet_id')
        .eq('liker_user_id', user.id)
        .eq('liker_pet_id', mine.id)
      if (seenErr) { setMsg(seenErr.message); setLoading(false); return }
      const seenIds = new Set<string>((seenRows ?? []).map((r: any) => r.liked_pet_id as string))

      // candidate pets (others)
      const { data: candidates, error: candErr } = await supabase
        .from('pets')
        .select('*')
        .neq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)
      if (candErr) { setMsg(candErr.message); setLoading(false); return }

      const filtered = (candidates ?? []).filter((p: any) => !seenIds.has(p.id))
      setPets(filtered as Pet[])
      setIdx(0)
      setLoading(false)
    })()
  }, [])

  async function recordSwipe(target: Pet, liked: boolean) {
    if (!userId || !mePet) return
    const { error: likeErr } = await supabase.from('likes').insert({
      liker_user_id: userId,
      liker_pet_id: mePet.id,
      liked_pet_id: target.id,
      liked, // boolean
    })
    if (likeErr) { setMsg(likeErr.message); return }

    // if I liked, check for mutual like → match
    if (liked) {
      const { data: back, error: backErr } = await supabase
        .from('likes')
        .select('id')
        .eq('liker_pet_id', target.id)
        .eq('liked_pet_id', mePet.id)
        .eq('liked', true)
        .limit(1)
      if (!backErr && (back ?? []).length > 0) {
        await supabase.from('matches').insert({
          pet_a: mePet.id,
          pet_b: target.id,
          owner_a: userId,
          owner_b: target.user_id,
        })
      }
    }

    setIdx((i) => Math.min(i + 1, pets.length))
  }

  return (
    <main className="px-4">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="text-xl font-semibold">Find a match</h1>

        {loading && <p className="mt-6 text-gray-500">Loading…</p>}
        {msg && !loading && <p className="mt-6 text-red-600">{msg}</p>}
        {!loading && !current && !msg && (
          <p className="mt-6 text-gray-500">No more nearby pets for now. Check back later!</p>
        )}

        {current && (
          <div ref={cardRef} className="mt-4">
            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-gray-200 shadow-md">
              {current.photo_url ? (
                <img
                  src={current.photo_url}
                  alt={current.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-gray-500">No photo</div>
              )}

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                <div className="text-xl font-semibold">
                  {current.name}
                  {typeof current.age_months === 'number'
                    ? `, ${Math.floor(current.age_months / 12)}`
                    : ''}
                </div>
                <div className="text-sm text-white/80">
                  {(current.breed ?? current.species)}
                  {current.location ? ` • ${current.location}` : ''}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                onClick={() => recordSwipe(current, false)}
                className="grid h-12 w-12 place-items-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-100"
                aria-label="Dislike"
                title="Dislike"
              >
                ✖
              </button>

              <button
                onClick={() => recordSwipe(current, true)}
                className="grid h-14 w-14 place-items-center rounded-full bg-emerald-600 text-white shadow-lg transition hover:bg-emerald-700"
                aria-label="Like"
                title="Like"
              >
                ❤
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}