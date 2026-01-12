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
import { getLessonPlanService } from '@/lib/service';
import { showError, showSuccess } from '@/utils/notifications';
import Link from 'next/link';

export default function ProfessorPage() {
  const { user, isProfessor } = useAuth();
  const { subjects, loading: subjectsLoading, refresh: refreshSubjects } = useSubjects();
  const { units: allUnits, loading: unitsLoading, refresh: refreshUnits } = useUnits();
  const lessonPlanService = getLessonPlanService();

  const loading = subjectsLoading || unitsLoading;
  
  // Ordena unidades por data de criação (mais recente primeiro) e pega as 5 mais recentes
  const recentUnits = [...allUnits]
    .sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
      const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

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

  const handleDeleteSubject = (id: string) => {
    try {
      lessonPlanService.deleteSubject(id);
      showSuccess('Disciplina excluída com sucesso!');
      refreshSubjects();
      refreshUnits();
    } catch (error: any) {
      showError(error.message || 'Erro ao excluir disciplina');
    }
  };

  const handleDeleteUnit = (id: string) => {
    try {
      lessonPlanService.deleteUnit(id);
      showSuccess('Unidade excluída com sucesso!');
      refreshUnits();
    } catch (error: any) {
      showError(error.message || 'Erro ao excluir unidade');
    }
  };

  const stats = [
    { title: 'Disciplinas', value: subjects.length },
    { title: 'Unidades', value: allUnits.length },
    { title: 'Planos de Aula', value: allUnits.filter(u => u.lessonPlanId).length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-50 to-white shadow-md border-b border-gray-200 p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Gerencie suas disciplinas e materiais didáticos</p>
      </div>

      <PageContainer>
        <StatsSection stats={stats} />

        <div className="mb-8">
          <Link href="/professor/disciplinas/new">
            <Button>➕ Nova Disciplina</Button>
          </Link>
        </div>

        {subjects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
            <EmptyState
              title="Nenhuma disciplina cadastrada"
              description="Comece criando uma nova disciplina para organizar seus materiais didáticos"
              action={
                <Link href="/professor/disciplinas/new">
                  <Button>➕ Nova Disciplina</Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-200 mb-8 transition-all duration-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-xl font-bold text-gray-900">Disciplinas</h2>
            </div>
            <div className="p-6">
              <SubjectsList
                subjects={subjects}
                units={allUnits}
                showUnitCount
                canDelete={true}
                onDelete={handleDeleteSubject}
                emptyStateTitle="Nenhuma disciplina cadastrada"
                emptyStateDescription="Comece criando uma nova disciplina"
              emptyStateAction={
                <Link href="/professor/disciplinas/new">
                  <Button>➕ Nova Disciplina</Button>
                </Link>
              }
              />
            </div>
          </div>
        )}

        {recentUnits.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-xl font-bold text-gray-900">Unidades Recentes</h2>
            </div>
            <div className="p-6">
              <UnitsList
                units={recentUnits}
                subjects={subjects}
                showSubject
                canDelete={true}
                onDelete={handleDeleteUnit}
              />
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
