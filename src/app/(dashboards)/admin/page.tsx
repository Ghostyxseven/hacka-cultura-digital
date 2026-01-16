'use client';

import { useAuth } from '@/contexts/AuthContext';
import { PageContainer } from '@/components/layout/PageContainer';
import { HeaderWithAuth } from '@/components/layout/HeaderWithAuth';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <HeaderWithAuth />
      <PageContainer>
        <div className="py-8">
          <h1 className="text-3xl font-bold mb-6">Painel do Administrador</h1>
          <p className="text-gray-600">Bem-vindo, {user?.name}!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Estatísticas serão adicionadas aqui */}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
