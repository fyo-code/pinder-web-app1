'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function signIn() {
    try {
      setLoading(true)
      setMsg(null)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      setMsg('Signed in! You can go to /create-pet or /swipe')
    } catch (e: any) {
      setMsg(e.message ?? 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  async function signUp() {
    try {
      setLoading(true)
      setMsg(null)
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      setMsg('Check your email to confirm your account.')
    } catch (e: any) {
      setMsg(e.message ?? 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100">
            <span className="text-pink-500 text-xl">❤</span>
          </div>
          <h1 className="text-2xl font-semibold">Pinder • Login</h1>
          <p className="text-sm text-neutral-500">Find the perfect match for your pet</p>
        </div>

        {/* Card */}
        <div className="card p-6">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                className="btn-primary w-full"
                disabled={loading}
                onClick={signIn}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
              <button
                className="btn-ghost w-full"
                disabled={loading}
                onClick={signUp}
              >
                Sign Up
              </button>
            </div>

            {msg && (
              <p className="text-sm text-neutral-600">{msg}</p>
            )}
          </div>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-neutral-500">
          Continue as guest? <a className="text-pink-600 hover:underline" href="/swipe">Open Swiping</a>
        </p>
      </div>
    </main>
  )
}