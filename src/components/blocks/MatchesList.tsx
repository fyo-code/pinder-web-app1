'use client'
import Link from 'next/link'

type MatchItem = { id: string; pet_name: string; photo_url?: string|null; last_msg?: string|null }

export default function MatchesList({ items }: { items: MatchItem[] }) {
  if (!items.length) return <p className="text-center text-gray-500">No matches yet.</p>
  return (
    <ul className="divide-y divide-gray-100 rounded-2xl border bg-white">
      {items.map(m => (
        <li key={m.id} className="flex items-center gap-3 px-4 py-3">
          <img src={m.photo_url ?? '/placeholder.svg'} className="h-10 w-10 rounded-full object-cover" />
          <div className="flex-1">
            <div className="font-medium">{m.pet_name}</div>
            <div className="text-sm text-gray-500 line-clamp-1">{m.last_msg ?? 'Say hi!'}</div>
          </div>
          <Link href={`/chat/${m.id}`} className="text-sm text-indigo-600 hover:underline">Open</Link>
        </li>
      ))}
    </ul>
  )
}