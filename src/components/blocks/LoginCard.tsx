'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginCard() {
  const [email, setEmail] = useState(''), [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false), [msg, setMsg] = useState<string|null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false); setMsg(error ? error.message : 'Signed in!')
    if (!error) window.location.href = '/swipe'
  }

  return (
    <div className="mx-auto mt-12 max-w-md rounded-2xl border border-black/5 bg-white p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)]">
      {/* TODO: paste your pretty login HTML here; just wire inputs to setEmail/setPassword and submit to onSubmit */}
      <h1 className="text-2xl font-semibold">Welcome back</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)}
                 className="w-full rounded-lg border px-3 py-2" placeholder="you@email.com" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)}
                 className="w-full rounded-lg border px-3 py-2" placeholder="••••••••" />
        </div>
        {msg && <p className="text-sm text-gray-600">{msg}</p>}
        <button disabled={busy} className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-white">{busy ? 'Signing in…' : 'Sign In'}</button>
      </form>
    </div>
  )
}