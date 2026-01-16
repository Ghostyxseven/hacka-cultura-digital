'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Página inicial - Redireciona para o dashboard do professor
 * Mantém consistência com layout de sidebar em todas as páginas
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona automaticamente para o dashboard do professor (com sidebar)
    router.replace('/professor');
  }, [router]);

  // Mostra loading enquanto redireciona
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando dashboard...</p>
      </div>
    </div>
  );
}
