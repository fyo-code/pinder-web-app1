// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import TopNav from '@/components/TopNav' // keep your existing nav

export const metadata: Metadata = {
  title: 'Pinder',
  description: "Find your pet's perfect match",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-5xl px-4">
          <TopNav />
          <main className="py-6">{children}</main>
        </div>
      </body>
    </html>
  )
}