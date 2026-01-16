'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function HeaderWithAuth() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Materiais Didáticos
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">{user?.name}</span>
          <button
            onClick={logout}
            className="btn-secondary"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
