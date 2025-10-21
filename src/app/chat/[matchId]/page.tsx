'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type MatchRow = {
  id: string;
  owner_a: string;
  owner_b: string;
  pet_a: string;
  pet_b: string;
};

type Message = {
  id: string;
  match_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export default function ChatPage() {
  const params = useParams<{ matchId: string }>();
  const matchId = params.matchId;

  const [userId, setUserId] = useState<string | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // 1) auth + membership guard
  useEffect(() => {
    (async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { setAllowed(false); setUserId(null); return; }
      setUserId(user.id);

      const { data: rows, error: mErr } = await supabase
        .from('matches')
        .select('id, owner_a, owner_b, pet_a, pet_b')
        .eq('id', matchId)
        .limit(1);

      if (mErr || !rows || rows.length === 0) { setAllowed(false); return; }

      const m = rows[0] as MatchRow;
      setAllowed(m.owner_a === user.id || m.owner_b === user.id);
    })();
  }, [matchId]);

  // 2) initial load + realtime
  useEffect(() => {
    if (allowed !== true) return;

    let unsub = () => {};
    (async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('id, match_id, sender_id, body, created_at')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

      if (error) setMsg(error.message);
      setMessages((data ?? []) as Message[]);

      // realtime inserts
      const channel = supabase.channel(`chat-${matchId}`)
        .on('postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `match_id=eq.${matchId}`,
          },
          (payload) => {
            const row = payload.new as Message;
            setMessages((prev) => [...prev, row]);
          }
        )
        .subscribe();

      unsub = () => { supabase.removeChannel(channel); };
    })();

    return () => unsub();
  }, [allowed, matchId]);

  useEffect(() => {
    // scroll to bottom on new message
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages.length]);

  if (allowed === false) return notFound();
  if (allowed === null)  return <main style={{padding:16}}><p>Loading…</p></main>;

  async function send() {
    if (!userId)  return;
    if (!input.trim()) return;

    const { error } = await supabase.from('messages').insert({
      match_id: matchId,
      sender_id: userId,
      body: input.trim(),
    });

    if (error) { setMsg(error.message); return; }
    setInput('');
  }

  return (
    <main style={{padding:16, height:'calc(100dvh - 32px)', display:'grid', gridTemplateRows:'1fr auto', gap:12}}>
      <div
        ref={listRef}
        style={{overflowY:'auto', border:'1px solid #e5e7eb', borderRadius:12, padding:12}}
      >
        {messages.length === 0 && <p style={{color:'#6b7280'}}>No messages yet. Say hi 👋</p>}
        {messages.map(m => (
          <div key={m.id} style={{marginBottom:10, display:'flex', justifyContent: m.sender_id === userId ? 'flex-end' : 'flex-start'}}>
            <div style={{
              maxWidth:'75%',
              background: m.sender_id === userId ? '#111827' : '#f3f4f6',
              color: m.sender_id === userId ? 'white' : '#111827',
              padding:'8px 12px',
              borderRadius:12
            }}>
              {m.body}
              <div style={{fontSize:10, opacity:0.7, marginTop:4}}>
                {new Date(m.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{display:'flex', gap:8}}>
        <input
          value={input}
          onChange={e=>setInput(e.target.value)}
          placeholder="Type a message…"
          style={{flex:1, padding:'10px 12px', border:'1px solid #e5e7eb', borderRadius:10}}
          onKeyDown={(e)=>{ if (e.key === 'Enter') send(); }}
        />
        <button onClick={send} style={{padding:'10px 14px', borderRadius:10, background:'#111827', color:'white'}}>
          Send
        </button>
      </div>

      {msg && <p style={{color:'#b91c1c'}}>{msg}</p>}
    </main>
  );
}