'use client'
import Link from 'next/link'

export default function BottomTabs() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto grid max-w-5xl grid-cols-3 text-sm">
        <Link href="/swipe" className="grid place-items-center py-3">Find</Link>
        <Link href="/matches" className="grid place-items-center py-3">Matches</Link>
        <Link href="/login" className="grid place-items-center py-3">Chat</Link>
      </div>
    </div>
  )
}