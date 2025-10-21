'use client';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function TopNav() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    })();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 16px',
      borderBottom: '1px solid #e5e7eb',
      background: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <Link href="/" style={{ fontWeight: 600 }}>Pinder</Link>
        <Link href="/swipe">Swipe</Link>
        <Link href="/matches">Matches</Link>
        <Link href="/create-pet">Create Pet</Link>
      </div>

      {user ? (
        <button onClick={signOut} style={{
          background: '#111827',
          color: 'white',
          borderRadius: 8,
          padding: '6px 10px',
          border: 'none'
        }}>
          Sign out
        </button>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </nav>
  );
}