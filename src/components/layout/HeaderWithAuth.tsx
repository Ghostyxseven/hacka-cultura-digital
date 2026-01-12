// src/components/layout/HeaderWithAuth.tsx
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

interface HeaderWithAuthProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}

export function HeaderWithAuth({ title, subtitle, backHref, backLabel = '← Voltar' }: HeaderWithAuthProps) {
  const { user, logout, isAdmin, isProfessor, isAluno } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {backHref && (
              <Link href={backHref} className="text-primary-600 hover:text-primary-700 mb-2 inline-block">
                {backLabel}
              </Link>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">
                  {isAdmin && 'Administrador'}
                  {isProfessor && 'Professor'}
                  {isAluno && 'Aluno'}
                </p>
              </div>
            )}
            <Button variant="secondary" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
