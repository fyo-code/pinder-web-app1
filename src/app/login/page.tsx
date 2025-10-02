'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function signIn(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    setMsg(error ? error.message : 'Signed in!')
  }

  async function signUp() {
    setMsg(null); setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    setMsg(error ? error.message : 'Check your email to confirm the sign up.')
  }

  return (
    <main>
      <h1>Pinder • Login</h1>

      <div>
        New here? <button onClick={signUp}>Create an account</button>
      </div>

      <form onSubmit={signIn}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
        <button disabled={loading}>Sign In</button>
      </form>

      <div style={{ marginTop: 8 }}>
        <Link href="/create-pet">Create Pet →</Link>{' '}
        <Link href="/swipe">Go Swiping →</Link>
      </div>

      {msg && <p>{msg}</p>}
    </main>
  )
}