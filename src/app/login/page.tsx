'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    setMsg(error ? error.message : 'Signed in!');
  }

  async function signUp() {
    setMsg(null); setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    setMsg(error ? error.message : 'Check your email to confirm your account.');
  }

  return (
    <main className="container">
      <div className="card centered">
        <h1>Pinder • Login</h1>

        <form className="stack" onSubmit={signIn}>
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>

          <div className="stack" style={{marginTop: '6px'}}>
            <button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
            <button type="button" onClick={signUp} disabled={loading}>Create an account</button>
          </div>
        </form>

        <div className="link-row">
          <a href="/create-pet">Create Pet →</a>
          <a href="/swipe">Go Swiping →</a>
        </div>

        {msg && <p style={{marginTop:12}}>{msg}</p>}
      </div>
    </main>
  );
}