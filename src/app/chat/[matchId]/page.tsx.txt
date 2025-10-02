'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Message = {
  id: string;
  match_id: string;
  sender_user_id: string;
  text: string;
  created_at: string;
};

export default function ChatPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setMsg('Please log in.'); return; }
      setUserId(user.id);
      await load();
    })();
    // simple polling; we can swap to realtime later
    const t = setInterval(load, 2000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  async function load() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true })
      .limit(200);
    if (error) { setMsg(error.message); return; }
    setMessages((data ?? []) as Message[]);
    // scroll to bottom
    setTimeout(() => listRef.current?.scrollTo({ top: 1e9, behavior: 'smooth' }), 0);
  }

  async function send() {
    if (!input.trim() || !userId) return;
    const text = input.trim();
    setInput('');
    const { error } = await supabase.from('messages').insert({
      match_id: matchId,
      sender_user_id: userId,
      text
    });
    if (error) setMsg(error.message);
    else load();
  }

  return (
    <main className="container">
      <div className="card" style={{maxWidth: 900, margin: '0 auto', display:'grid', gridTemplateRows:'auto 1fr auto', height:'80vh'}}>
        <h1>Chat</h1>
        <div ref={listRef} style={{overflow:'auto', padding:'8px 0', borderTop:'1px solid #eee', borderBottom:'1px solid #eee'}}>
          {messages.map(m => {
            const mine = m.sender_user_id === userId;
            return (
              <div key={m.id} style={{display:'flex', justifyContent: mine ? 'flex-end' : 'flex-start', padding:'6px 0'}}>
                <div style={{
                  maxWidth:'70%', padding:'10px 12px', borderRadius:16,
                  background: mine ? '#ec4899' : '#f3f4f6',
                  color: mine ? 'white' : '#111827'
                }}>
                  {m.text}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{display:'flex', gap:8, paddingTop:8}}>
          <input
            placeholder="Type your message…"
            value={input}
            onChange={e=>setInput(e.target.value)}
            style={{flex:1}}
          />
          <button onClick={send}>Send</button>
        </div>

        {msg && <p style={{marginTop:8}}>{msg}</p>}
      </div>
    </main>
  );
}