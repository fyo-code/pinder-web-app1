'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    setMessage(error ? error.message : 'Signed in! Go to /create-pet or /swipe.');
  }

  async function handleSignUp() {
    setMessage(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    setMessage(error ? error.message : 'Check your inbox to confirm your email.');
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-pink-100">
        <div className="px-6 pt-6">
          <h1 className="text-2xl font-semibold text-gray-900">Pinder • Login</h1>
          <p className="mt-1 text-sm text-gray-500">
            New here?{' '}
            <button
              type="button"
              onClick={handleSignUp}
              className="text-pink-600 hover:text-pink-700 font-medium"
              disabled={loading}
            >
              Create an account
            </button>
          </p>
        </div>

        <form onSubmit={handleSignIn} className="p-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={onEmailChange}
            placeholder="Email"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-pink-400"
            required
          />
          <input
            type="password"
            value={password}
            onChange={onPasswordChange}
            placeholder="Password"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-pink-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-pink-600 py-3 text-white font-medium hover:bg-pink-700 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <div className="flex items-center justify-between text-sm">
            <Link href="/create-pet" className="text-gray-500 hover:text-gray-700">
              Create Pet →
            </Link>
            <Link href="/swipe" className="text-pink-600 hover:text-pink-700">
              Go Swiping →
            </Link>
          </div>

          {message && (
            <p className="text-center text-sm text-gray-700">{message}</p>
          )}
        </form>
      </div>
    </main>
  );
}