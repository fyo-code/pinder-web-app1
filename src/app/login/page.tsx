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
    setMsg(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    setMsg(error ? error.message : 'Signed in ✔︎');
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    setMsg(error ? error.message : 'Check your inbox to confirm your email.');
  }

  return (
    <main className="min-h-screen bg-zinc-100 p-6">
      <div className="mx-auto max-w-md bg-white p-6 rounded-2xl shadow-lg border border-zinc-200">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-4">Pinder • Login</h1>

        <form className="space-y-3">
          <input
            className="w-full border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 p-2 rounded"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 p-2 rounded"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={signIn}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:opacity-50"
          >
            {loading ? 'Working…' : 'Sign In'}
          </button>

          <button
            onClick={signUp}
            disabled={loading}
            className="w-full bg-zinc-900 hover:bg-black text-white py-2 rounded transition disabled:opacity-50"
          >
            {loading ? 'Working…' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-3 text-sm text-zinc-700">{msg}</p>
      </div>
    </main>
  );
}