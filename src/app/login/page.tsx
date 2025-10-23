'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin'|'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return setMsg(error.message);
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) return setMsg(error.message);
        // If email confirmation is ON, let the user know:
        if (data.user && !data.user.confirmed_at) {
          setMsg('Check your email to confirm your account.');
          return;
        }
      }
      router.push('/swipe');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] grid place-items-center bg-gray-50">
      <div className="w-full max-w-xl rounded-2xl border border-black/5 bg-white p-8 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.25)]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Sign {mode === 'signin' ? 'in' : 'up'}</h1>
          <p className="text-sm text-gray-600 mt-2">
            {mode === 'signin' ? 'Sign in to access your account' : 'Create an account to get started'}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="block w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-gray-300"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              {mode === 'signin' && (
                <a className="text-xs text-rose-600 hover:underline" href="#">Forgot password?</a>
              )}
            </div>
            <input
              id="password"
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              required
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="block w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-gray-300"
              placeholder="********"
            />
          </div>

          {msg && <p className="text-sm text-red-600">{msg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-rose-600 px-8 py-3 font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
          >
            {loading ? (mode === 'signin' ? 'Signing in…' : 'Creating account…') : (mode === 'signin' ? 'Sign in' : 'Sign up')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {mode === 'signin' ? "Don't have an account yet?" : 'Already have an account?'}{' '}
          <button
            type="button"
            className="underline text-rose-600"
            onClick={()=> setMode(mode === 'signin' ? 'signup' : 'signin')}
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}