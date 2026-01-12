// src/app/(dashboards)/professor/planos/page.tsx
// Página para listar todos os planos de aula do professor
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useSubjects } from '@/hooks/useSubjects';
import { useUnits } from '@/hooks/useUnits';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { UnitsList } from '@/app/components';
import Link from 'next/link';

export default function MeusPlanosPage() {
  const { user, isProfessor } = useAuth();
  const { subjects, loading: subjectsLoading } = useSubjects();
  const { units: allUnits, loading: unitsLoading } = useUnits();

  const loading = subjectsLoading || unitsLoading;

  if (!isProfessor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  // Filtra apenas unidades que têm plano de aula
  const unitsWithPlans = allUnits.filter(u => u.lessonPlanId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-50 to-white shadow-md border-b border-gray-200 p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">📚 Meus Planos de Aula</h2>
        <p className="text-gray-600">Visualize e gerencie todos os seus planos de aula</p>
      </div>

      <PageContainer>
        {unitsWithPlans.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
            <EmptyState
              title="Nenhum plano de aula gerado ainda"
              description="Comece criando disciplinas e unidades, depois gere planos de aula usando a IA"
              action={
                <div className="flex gap-4 justify-center mt-6">
                  <Link href="/subjects/new">
                    <Button>➕ Nova Disciplina</Button>
                  </Link>
                  <Link href="/professor">
                    <Button variant="secondary">📊 Voltar ao Dashboard</Button>
                  </Link>
                </div>
              }
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-xl font-bold text-gray-900">
                Planos de Aula ({unitsWithPlans.length})
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {unitsWithPlans.length === 1 
                  ? '1 plano de aula gerado' 
                  : `${unitsWithPlans.length} planos de aula gerados`}
              </p>
            </div>
            <div className="p-6">
              <UnitsList
                units={unitsWithPlans}
                subjects={subjects}
                showSubject
                emptyStateTitle="Nenhum plano de aula encontrado"
                emptyStateDescription="Comece gerando planos de aula para suas unidades"
              />
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
