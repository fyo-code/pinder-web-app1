'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="border-b border-black/5 bg-white/70 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          {/* Replace with your logo if you have one in /public/logo.svg */}
          <img src="/logo.svg" alt="Pinder" className="h-6 w-6" />
          <span className="text-lg font-semibold">Pinder</span>
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <Link href="/swipe" className="hover:opacity-80">Swipe</Link>
          <Link href="/matches" className="hover:opacity-80">Matches</Link>
          <Link href="/create-pet" className="hover:opacity-80">Create Pet</Link>
          <Link href="/login" className="hover:opacity-80">Login</Link>
        </div>
      </nav>
    </header>
  )
}