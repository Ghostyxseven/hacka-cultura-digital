'use client';

import { useAuth } from '@/contexts/AuthContext';
import { PageContainer } from '@/components/layout/PageContainer';

export default function AlunoDashboard() {
  const { user } = useAuth();

  return (
    <PageContainer>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-6">Meus Aprendizados</h1>
        <p className="text-gray-600">Bem-vindo, {user?.name}!</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Disciplinas e unidades serão exibidas aqui */}
        </div>
      </div>
    </PageContainer>
  );
}
