'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  async function signUp() {
    setMsg(null);
    const { error } = await supabase.auth.signUp({ email, password });
    setMsg(error ? error.message : 'Check your email to confirm, then sign in.');
  }

  async function signIn() {
    setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMsg(error ? error.message : 'Signed in!');
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md space-y-3 bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-semibold">Pinder • Login</h1>

        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded" onClick={signIn}>
          Sign In
        </button>
        <button className="w-full bg-gray-200 py-2 rounded" onClick={signUp}>
          Sign Up
        </button>

        {msg && <p className="text-sm text-gray-600">{msg}</p>}

        <div className="text-right text-sm">
          <Link className="text-blue-600" href="/create-pet">Continue →</Link>
        </div>
      </div>
    </main>
  );
}