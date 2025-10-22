'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setMsg(error.message)
    router.push('/swipe')
  }

  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-black/5 bg-white p-8 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.25)]">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-500">Sign in to continue to Pinder.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email" type="email" autoComplete="email" required
              value={email} onChange={e=>setEmail(e.target.value)}
              className="block w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-gray-300"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password" type="password" autoComplete="current-password" required
              value={password} onChange={e=>setPassword(e.target.value)}
              className="block w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-gray-300"
              placeholder="••••••••"
            />
          </div>

          {msg && <p className="text-sm text-red-600">{msg}</p>}

          <button
            type="submit" disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <div className="flex items-center justify-between text-sm pt-1">
            <a href="/create-pet" className="underline">Create Pet →</a>
            <a href="/swipe" className="underline">Go Swiping →</a>
          </div>
        </form>
      </div>
    </div>
  )
}