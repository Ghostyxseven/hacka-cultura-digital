// src/app/(dashboards)/aluno/layout.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { showSuccess } from '@/utils/notifications';

export default function AlunoLayout({
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>👨‍🎓</span>
                <span>Aluno</span>
              </h1>
              <p className="text-sm text-gray-600">{user?.name}</p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            onClick={handleLogout}
            className="hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-200"
          >
            🚪 Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
