'use client'
type Msg = { id: string; mine: boolean; text: string; created_at?: string }

export default function ChatThread({ messages }: { messages: Msg[] }) {
  return (
    <div className="space-y-2">
      {messages.map(m => (
        <div key={m.id} className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${m.mine ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>
            {m.text}
          </div>
        </div>
      ))}
    </div>
  )
}