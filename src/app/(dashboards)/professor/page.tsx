// src/app/(dashboards)/professor/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubjects, useUnits, useRecentUnits } from '@/hooks';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading, PageSkeleton } from '@/components';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatsSection, SubjectsList, UnitsList, ClassCard } from '@/app/components';
import { LazyTeacherMural } from '@/components/lazy';
import { getClassService, getLessonPlanService } from '@/lib/service';
import { showError, showSuccess } from '@/utils/notifications';
import { Class } from '@/core/entities/Class';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfessorPage() {
  const router = useRouter();
  const { user, isProfessor } = useAuth();
  const { subjects, loading: subjectsLoading, refresh: refreshSubjects } = useSubjects();
  const { units: allUnits, loading: unitsLoading, refresh: refreshUnits } = useUnits();
  const recentUnits = useRecentUnits(allUnits, 5);
  const lessonPlanService = getLessonPlanService();

  const [classes, setClasses] = useState<Class[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);

  const loading = subjectsLoading || unitsLoading || classesLoading;

  useEffect(() => {
    if (isProfessor && user?.id) {
      loadClasses();
    }
  }, [isProfessor, user]);

  const loadClasses = () => {
    try {
      const classService = getClassService();
      const teacherClasses = classService.getTeacherClasses(user!.id);
      setClasses(teacherClasses);
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
    } finally {
      setClassesLoading(false);
    }
  };

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
    return (
      <PageContainer>
        <PageSkeleton />
      </PageContainer>
    );
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
    { title: 'Turmas', value: classes.length },
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
        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button
            className="h-auto py-6 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg transform hover:scale-105 transition-all"
            onClick={() => window.location.href = '/professor/disciplinas/new'}
          >
            <span className="text-3xl">✨</span>
            <span className="font-bold">Planejar Aula</span>
          </Button>

          <Button
            className="h-auto py-6 flex flex-col items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
            onClick={() => window.location.href = '/professor/turmas'}
          >
            <span className="text-3xl">📝</span>
            <span className="font-bold">Diário de Classe</span>
          </Button>

          <Button
            className="h-auto py-6 flex flex-col items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
            onClick={() => router.push('/professor/disciplinas')}
          >
            <span className="text-3xl">📚</span>
            <span className="font-bold">Conteúdos</span>
          </Button>

          <Button
            className="h-auto py-6 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg transform hover:scale-105 transition-all"
            onClick={() => showSuccess('Funcionalidade de Correção Assistida em breve!')}
          >
            <span className="text-3xl">✅</span>
            <span className="font-bold">Corrigir Atividades</span>
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="mb-8">
          <StatsSection stats={stats} />
        </div>

        {/* Seção de Turmas */}
        {classes.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200 mb-8 transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏫</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Minhas Turmas</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {classes.length} {classes.length === 1 ? 'turma' : 'turmas'} em que você leciona
                    </p>
                  </div>
                </div>
                <Link href="/professor/turmas">
                  <Button variant="secondary" size="sm">
                    Ver Todas
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.slice(0, 6).map((classEntity) => (
                  <Link key={classEntity.id} href={`/professor/turmas/${classEntity.id}`}>
                    <ClassCard
                      classEntity={classEntity}
                      showActions={false}
                    />
                  </Link>
                ))}
              </div>
              {classes.length > 6 && (
                <div className="mt-4 text-center">
                  <Link href="/professor/turmas">
                    <Button variant="secondary">
                      Ver todas as {classes.length} turmas
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mural de Avisos (Fase 4) */}
        <div className="mb-8">
          <LazyTeacherMural />
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
