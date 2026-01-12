// src/app/(dashboards)/professor/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useSubjects } from '@/hooks/useSubjects';
import { useUnits } from '@/hooks/useUnits';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatsSection, SubjectsList, UnitsList } from '@/app/components';
import Link from 'next/link';

export default function ProfessorPage() {
  const { user, isProfessor } = useAuth();
  const { subjects, loading: subjectsLoading } = useSubjects();
  const { units: allUnits, loading: unitsLoading } = useUnits();

  const loading = subjectsLoading || unitsLoading;
  const recentUnits = allUnits.slice(0, 5);

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

  const stats = [
    { title: 'Disciplinas', value: subjects.length },
    { title: 'Unidades', value: allUnits.length },
    { title: 'Planos de Aula', value: allUnits.filter(u => u.lessonPlanId).length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b p-4">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-600">Gerencie suas disciplinas e materiais didáticos</p>
      </div>

      <PageContainer>
        <StatsSection stats={stats} />

        <div className="mb-8">
          <Link href="/subjects/new">
            <Button>➕ Nova Disciplina</Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Disciplinas</h2>
          </div>
          <div className="p-6">
            <SubjectsList
              subjects={subjects}
              units={allUnits}
              showUnitCount
              emptyStateTitle="Nenhuma disciplina cadastrada"
              emptyStateDescription="Comece criando uma nova disciplina"
              emptyStateAction={
                <Link href="/subjects/new">
                  <Button>➕ Nova Disciplina</Button>
                </Link>
              }
            />
          </div>
        </div>

        {recentUnits.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Unidades Recentes</h2>
            </div>
            <div className="p-6">
              <UnitsList
                units={recentUnits}
                subjects={subjects}
                showSubject
              />
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
