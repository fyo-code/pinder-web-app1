import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pinder',
  description: 'Find your perfect pet match',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen pb-20 bg-zinc-100">
        {children}

        {/* bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200">
          <div className="mx-auto max-w-md grid grid-cols-3">
            <Link href="/swipe" className="flex flex-col items-center py-3 text-zinc-700 hover:text-zinc-900">
              <span className="text-xl">🔎</span>
              <span className="text-xs">Find</span>
            </Link>
            <Link href="/login" className="flex flex-col items-center py-3 text-zinc-700 hover:text-zinc-900">
              <span className="text-xl">💬</span>
              <span className="text-xs">Login</span>
            </Link>
            <Link href="/create-pet" className="flex flex-col items-center py-3 text-zinc-700 hover:text-zinc-900">
              <span className="text-xl">➕</span>
              <span className="text-xs">Create</span>
            </Link>
          </div>
        </nav>
      </body>
    </html>
  );
}
