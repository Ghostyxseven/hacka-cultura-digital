// src/components/auth/ProtectedRoute.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loading } from '@/components/ui/Loading';
import { UserRole } from '@/core/entities/User';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  requireAuth = true 
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && requireAuth) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redireciona para o dashboard apropriado
        if (user.role === 'admin') {
          router.push('/admin');
        } else if (user.role === 'professor') {
          router.push('/professor');
        } else if (user.role === 'aluno') {
          router.push('/aluno');
        }
      }
    }
  }, [loading, isAuthenticated, user, allowedRoles, requireAuth, router]);

  if (loading) {
    return <Loading />;
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requireAuth && allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
