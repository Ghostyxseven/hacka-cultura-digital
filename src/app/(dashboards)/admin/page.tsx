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
          <p className="text-error font-bold">Acesso negado. Apenas administradores podem acessar esta página.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
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

        <Link href="/admin/usuarios">
          <StatCard
            title="Usuários"
            value="Gerenciar"
            description="Gerencie usuários do sistema"
            icon="👥"
            className="cursor-pointer hover:shadow-lg transition-shadow"
          />
        </Link>

        <Link href="/admin/turmas">
          <StatCard
            title="Turmas"
            value="Gerenciar"
            description="Gerencie turmas do sistema"
            icon="🏫"
            className="cursor-pointer hover:shadow-lg transition-shadow"
          />
        </Link>

        <Link href="/admin/promocao">
          <StatCard
            title="Promoção de Alunos"
            value="Avançar"
            description="Promover alunos de ano/turma em lote"
            icon="🎓"
            className="cursor-pointer hover:shadow-lg transition-shadow"
          />
        </Link>
      </div>

      <div className="bg-surface rounded-lg border border-border p-6 shadow-sm">
        <h2 className="text-xl font-bold text-text-main mb-4">Ações Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/auditoria">
            <Button variant="primary">
              📋 Ver Logs de Auditoria
            </Button>
          </Link>
          <Link href="/admin/usuarios">
            <Button variant="secondary">
              👥 Gerenciar Usuários
            </Button>
          </Link>
          <Link href="/admin/turmas">
            <Button variant="secondary">
              🏫 Gerenciar Turmas
            </Button>
          </Link>
          <Link href="/admin/promocao">
            <Button variant="primary">
              🎓 Promoção em Lote
            </Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
