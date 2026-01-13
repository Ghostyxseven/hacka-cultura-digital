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
      {/* Header Moderno */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg transform hover:scale-110 transition-transform duration-200">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">👨‍🎓</span>
                  <span>Aluno</span>
                </h1>
                <p className="text-sm text-gray-600 font-medium">{user?.name}</p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              onClick={handleLogout}
              className="hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <span className="mr-2">🚪</span>
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-8">{children}</main>
    </div>
  );
}
