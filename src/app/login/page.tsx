'use client';

import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    setLoading(false);
    setMsg(error ? error.message : 'Signed in! You can go swiping.');
  }

  return (
    <main className="container" style={{maxWidth: 480, margin:'0 auto', padding: 16}}>
      <h1>Login</h1>

      <form onSubmit={onSignIn} style={{display:'grid', gap:8, marginTop:12}}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
        <button disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
      </form>

      {msg && <p style={{marginTop:8}}>{msg}</p>}

      <div style={{marginTop:12, display:'flex', gap:12}}>
        <Link href="/create-pet">Create Pet →</Link>
        <Link href="/swipe">Go Swiping →</Link>
      </div>
    </main>
  );
}