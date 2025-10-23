import './globals.css';
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Pinder',
  description: 'Find your pet’s perfect match 🐾',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-8 py-4 shadow-sm bg-white">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold text-xl text-brand">
              Pinder
            </Link>
            <Link href="/swipe">Swipe</Link>
            <Link href="/matches">Matches</Link>
            <Link href="/create-pet">Create Pet</Link>
          </div>
          <Link href="/login" className="text-brand font-medium">
            Login
          </Link>
        </nav>

        {/* Page Content */}
        <main className="max-w-3xl mx-auto px-4 py-10">{children}</main>
      </body>
    </html>
  );
}