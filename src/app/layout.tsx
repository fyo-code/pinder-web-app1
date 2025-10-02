// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pinder',
  description: 'Find the perfect match for your pet.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-grayBg text-gray-800 antialiased">
        {/* Page content */}
        <div className="mx-auto max-w-5xl px-4 pb-24">{children}</div>
      </body>
    </html>
  )
}