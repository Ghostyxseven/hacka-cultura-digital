'use client';

import Link from 'next/link';

/**
 * Header simples sem autenticação
 * Single User Application - não precisa de autenticação
 */
export function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700">
          Plataforma de Materiais Didáticos
        </Link>
      </div>
    </header>
  );
}
