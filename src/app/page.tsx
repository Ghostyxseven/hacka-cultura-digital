'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Redireciona conforme o papel do usuário
    if (user.role === 'admin') {
      router.push('/admin');
    } else if (user.role === 'professor') {
      router.push('/professor');
    } else if (user.role === 'aluno') {
      router.push('/aluno');
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecionando...</p>
    </div>
  );
}
