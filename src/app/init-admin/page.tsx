// src/app/init-admin/page.tsx
// Página temporária para inicializar admin (pode ser removida depois)
'use client';

import { useEffect, useState } from 'react';
import { initAdmin } from '@/lib/initAdmin';
import { useRouter } from 'next/navigation';

export default function InitAdminPage() {
  const [status, setStatus] = useState('Inicializando...');
  const router = useRouter();

  useEffect(() => {
    try {
      initAdmin();
      setStatus('✅ Usuário admin criado com sucesso!');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setStatus('❌ Erro ao criar usuário admin');
      console.error(error);
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Inicializando Admin</h1>
        <p className="text-gray-600">{status}</p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700"><strong>Email:</strong> micael@admin.com</p>
          <p className="text-sm text-gray-700"><strong>Senha:</strong> 123456</p>
        </div>
      </div>
    </div>
  );
}
