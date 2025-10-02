'use client';

import { useState } from 'react';
import Link from 'next/link';
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
    if (error) setMsg(error.message);
    else setMsg('Signed in! You can go to Create Pet or Swiping.');
  }

  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <h1 className="text-2xl font-semibold mb-1">Pinder • Login</h1>
          <p className="text-sm text-gray-500 mb-6">
            New here?{' '}
            <Link href="/login/sign-up" className="text-brand-pink hover:text-brand-dark">
              Create an account
            </Link>
          </p>

          <form onSubmit={signIn} className="space-y-4">
            <input
              className="w-full rounded-xl border border-gray-200 bg-white p-3 outline-none focus:ring-2 focus:ring-brand-light"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full rounded-xl border border-gray-200 bg-white p-3 outline-none focus:ring-2 focus:ring-brand-light"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button disabled={loading} className="btn btn-primary w-full">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {msg && <p className="mt-4 text-sm text-gray-700">{msg}</p>}

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link href="/create-pet" className="text-brand-pink hover:text-brand-dark">
              Create Pet →
            </Link>
            <Link href="/swipe" className="text-brand-pink hover:text-brand-dark">
              Go Swiping →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}