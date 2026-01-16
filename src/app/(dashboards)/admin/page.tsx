// src/app/(dashboards)/admin/page.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { PageContainer } from '@/components';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';

export default function AdminPage() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-red-600">Acesso negado. Apenas administradores podem acessar esta página.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
        <p className="text-gray-600">Gerencie usuários e monitore o sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link href="/admin/auditoria">
          <StatCard
            title="Logs de Auditoria"
            value="Ver Logs"
            description="Visualize todas as ações importantes do sistema"
            icon="📋"
            className="cursor-pointer hover:shadow-lg transition-shadow"
          />
        </Link>

        <StatCard
          title="Usuários"
          value="Gerenciar"
          description="Gerencie usuários do sistema"
          icon="👥"
        />

        <StatCard
          title="Sistema"
          value="Configurações"
          description="Configurações gerais do sistema"
          icon="⚙️"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/auditoria">
            <Button variant="primary">
              📋 Ver Logs de Auditoria
            </Button>
          </Link>
          <Button variant="secondary">
            👥 Gerenciar Usuários
          </Button>
          <Button variant="secondary">
            ⚙️ Configurações
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
