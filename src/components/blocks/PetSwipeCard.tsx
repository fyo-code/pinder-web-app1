'use client'
import { motion, PanInfo } from 'framer-motion'

type Pet = {
  id: string; name: string; species: 'dog'|'cat'|'horse';
  photo_url?: string|null; breed?: string|null; age_months?: number|null; location?: string|null;
}

export default function PetSwipeCard({
  pet, onLike, onNope,
}: { pet: Pet; onLike: ()=>void; onNope: ()=>void }) {

  function onDragEnd(_e: any, info: PanInfo) {
    if (info.offset.x > 120) onLike()
    else if (info.offset.x < -120) onNope()
  }

  return (
    <motion.div
      drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2}
      onDragEnd={onDragEnd}
      className="mx-auto w-full max-w-md select-none"
    >
      {/* TODO: paste your pretty swipe-card HTML inside this wrapper */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow">
        <div className="aspect-[4/5] bg-gray-100">
          {pet.photo_url && <img src={pet.photo_url} alt={pet.name} className="h-full w-full object-cover" />}
        </div>
        <div className="flex items-center justify-between p-4">
          <div>
            <div className="text-lg font-semibold">
              {pet.name}{typeof pet.age_months==='number' ? `, ${Math.floor(pet.age_months/12)}` : ''}
            </div>
            <div className="text-sm text-gray-500">
              {pet.breed ?? pet.species}{pet.location ? ` • ${pet.location}` : ''}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onNope} className="rounded-full border px-4 py-2">Nope</button>
            <button onClick={onLike} className="rounded-full bg-emerald-600 px-4 py-2 text-white">Like</button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}