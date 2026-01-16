'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Dashboard do Professor - Redireciona automaticamente para a página principal
 * Mantém apenas o dashboard principal em / para evitar duplicação
 */
export default function ProfessorDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona automaticamente para o dashboard principal
    router.replace('/');
  }, [router]);

  // Mostra loading enquanto redireciona
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecionando para o dashboard...</p>
      </div>
    </div>
  );
}
