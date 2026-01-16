'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.push('/');
    }
  }, [user, requiredRole, router]);

  if (!user) {
    return <div>Redirecionando...</div>;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <div>Acesso negado</div>;
  }

  return <>{children}</>;
}
