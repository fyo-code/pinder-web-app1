// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import TopNav from '@/components/TopNav';

export const metadata: Metadata = {
  title: 'Pinder',
  description: 'Find the perfect match for your pet',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#f9fafb', color: '#111827' }}>
        <TopNav />
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '16px' }}>
          {children}
        </div>
      </body>
    </html>
  );
}