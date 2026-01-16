// src/app/(dashboards)/admin/layout.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { showSuccess } from '@/utils/notifications';

export default function AdminLayout({
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
      <aside className="w-64 bg-white shadow-xl border-r border-gray-200 fixed h-full">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">🔧 Admin</h1>
              <p className="text-xs text-gray-600">{user?.name}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <Link 
            href="/admin"
            className="w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-700 font-medium transition-all duration-200 flex items-center gap-2 block"
          >
            <span>📊</span>
            <span>Dashboard</span>
          </Link>
          <Link 
            href="/admin/auditoria"
            className="w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-700 font-medium transition-all duration-200 flex items-center gap-2 block"
          >
            <span>📋</span>
            <span>Logs de Auditoria</span>
          </Link>
          <Link 
            href="/admin/usuarios"
            className="w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-700 font-medium transition-all duration-200 flex items-center gap-2 block"
          >
            <span>👥</span>
            <span>Usuários</span>
          </Link>
          <Link 
            href="/admin/turmas"
            className="w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-700 font-medium transition-all duration-200 flex items-center gap-2 block"
          >
            <span>🏫</span>
            <span>Turmas</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-gray-50">
          <Button
            variant="secondary"
            onClick={handleLogout}
            className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-200"
          >
            🚪 Sair
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
