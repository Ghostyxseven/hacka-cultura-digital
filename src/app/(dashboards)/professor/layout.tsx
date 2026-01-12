// src/app/(dashboards)/professor/layout.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { showSuccess } from '@/utils/notifications';

export default function ProfessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    showSuccess('Logout realizado com sucesso!');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-r fixed h-full">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">👨‍🏫 Professor</h1>
          <p className="text-sm text-gray-600 mt-1">{user?.name}</p>
        </div>

        <nav className="p-4 space-y-2">
          <Link href="/professor">
            <button className="w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
              📊 Dashboard
            </button>
          </Link>

          <Link href="/subjects/new">
            <button className="w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
              ➕ Nova Disciplina
            </button>
          </Link>

          <Link href="/professor">
            <button className="w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
              📚 Meus Planos
            </button>
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <Button
            variant="secondary"
            onClick={handleLogout}
            className="w-full"
          >
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}
