// src/app/(dashboards)/professor/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useSubjects, useUnits, useRecentUnits } from '@/hooks';
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
  const recentUnits = useRecentUnits(allUnits, 5);
  const lessonPlanService = getLessonPlanService();

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-gray-50">
      {/* Header Moderno */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-600 shadow-xl border-b border-primary-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="text-5xl">👨‍🏫</span>
              <span>Dashboard Professor</span>
            </h1>
            <p className="text-primary-100 text-lg">Gerencie suas disciplinas e materiais didáticos</p>
          </div>
        </div>
      </div>

      <PageContainer>
        {/* Estatísticas */}
        <div className="mb-8">
          <StatsSection stats={stats} />
        </div>

        {/* Botão Nova Disciplina */}
        <div className="mb-8">
          <Link href="/professor/disciplinas/new">
            <Button className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
              <span className="mr-2">➕</span>
              Nova Disciplina
            </Button>
          </Link>
        </div>

        {/* Seção de Disciplinas */}
        {subjects.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center mb-8">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-100 to-indigo-100 flex items-center justify-center">
                <span className="text-5xl">📚</span>
              </div>
              <EmptyState
                title="Nenhuma disciplina cadastrada ainda"
                description="Comece criando uma nova disciplina para organizar seus materiais didáticos"
                action={
                  <Link href="/professor/disciplinas/new">
                    <Button className="mt-6">
                      <span className="mr-2">➕</span>
                      Nova Disciplina
                    </Button>
                  </Link>
                }
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200 mb-8 transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-50 via-indigo-50 to-primary-50 px-6 py-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📚</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Disciplinas</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {subjects.length} {subjects.length === 1 ? 'disciplina cadastrada' : 'disciplinas cadastradas'}
                  </p>
                </div>
              </div>
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

        {/* Seção de Unidades Recentes */}
        {recentUnits.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200 transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 px-6 py-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Unidades Recentes</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {recentUnits.length} {recentUnits.length === 1 ? 'unidade recente' : 'unidades recentes'}
                  </p>
                </div>
              </div>
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
