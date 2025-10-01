'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    setMsg(error ? error.message : 'Signed in!');
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Pinder • Login</h1>

        <form onSubmit={handleSignIn} className="space-y-3">
          <input
            className="w-full rounded-lg border border-slate-300 bg-white p-3 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="w-full rounded-lg border border-slate-300 bg-white p-3 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {msg && <p className="mt-3 text-sm text-slate-700">{msg}</p>}

        <div className="mt-4 text-right">
          <a href="/create-pet" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            Continue →
          </a>
        </div>
      </div>
    </main>
  );
}