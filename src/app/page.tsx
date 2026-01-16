// src/app/page.tsx
// Rota: / (Dashboard - Redireciona baseado no role)
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loading } from '@/components/ui/Loading';

export default function HomePage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, isAdmin, isProfessor, isAluno } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (isAdmin) {
        router.push('/admin');
      } else if (isProfessor) {
        router.push('/professor');
      } else if (isAluno) {
        router.push('/aluno');
      }
    }
  }, [loading, isAuthenticated, isAdmin, isProfessor, isAluno, router]);

  if (loading) {
    return <Loading />;
  }

  return null;
}
