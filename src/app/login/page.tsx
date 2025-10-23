'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get('email')?.toString() || '';
    const password = form.get('password')?.toString() || '';

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) return setMsg(error.message);

    router.push('/swipe');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col max-w-md w-full p-6 rounded-md sm:p-10 bg-white dark:bg-gray-50 dark:text-gray-800 shadow-md">
        <div className="mb-8 text-center">
          <h1 className="my-3 text-4xl font-bold text-gray-800">Sign in</h1>
          <p className="text-sm text-gray-500">Sign in to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="leroy@jenkins.com"
                className="w-full px-3 py-2 border rounded-md border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-xs text-rose-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                name="password"
                id="password"
                required
                placeholder="*****"
                className="w-full px-3 py-2 border rounded-md border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {msg && <p className="text-sm text-red-600">{msg}</p>}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-3 font-semibold rounded-md bg-rose-600 text-gray-50 hover:bg-rose-700 transition disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <p className="px-6 text-sm text-center text-gray-600">
              Don&apos;t have an account yet?{' '}
              <a href="/create-pet" className="hover:underline text-rose-600">
                Sign up
              </a>
              .
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}