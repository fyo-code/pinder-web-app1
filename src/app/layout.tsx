// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css' // keep the file, even if empty

export const metadata: Metadata = {
  title: 'Pinder',
  description: 'Find the perfect match for your pet',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}