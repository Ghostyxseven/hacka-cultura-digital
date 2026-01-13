// src/app/(dashboards)/professor/disciplinas/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getLessonPlanService } from '@/lib/service';
import { PresentationMapper } from '@/application';
import type { SubjectViewModel } from '@/application/viewmodels';
import { useUnits } from '@/hooks/useUnits';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components';
import { UnitsList } from '@/app/components';
import { showError, showSuccess } from '@/utils/notifications';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';

export default function SubjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const subjectId = params.id as string;
  const { isProfessor, isAdmin } = useAuth();
  const canEdit = isProfessor || isAdmin;
  const [subject, setSubject] = useState<SubjectViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [suggesting, setSuggesting] = useState(false);
  const { units, refresh: refreshUnits } = useUnits(subjectId);
  const lessonPlanService = getLessonPlanService();

  useEffect(() => {
    const service = getLessonPlanService();

    try {
      const foundSubjectEntity = service.getSubjectById(subjectId);
      const foundSubject = foundSubjectEntity ? PresentationMapper.toSubjectViewModel(foundSubjectEntity) : undefined;

      if (!foundSubject) {
        router.push('/professor');
        return;
      }

      setSubject(foundSubject);
    } catch (error) {
      console.error('Erro ao carregar disciplina:', error);
      showError('Erro ao carregar disciplina');
    } finally {
      setLoading(false);
    }
  }, [subjectId, router]);

  const handleSuggestUnits = async () => {
    if (!subject) return;

    setSuggesting(true);
    try {
      const service = getLessonPlanService();
      const gradeYear = subject.gradeYears?.[0] || '8º Ano';
      await service.suggestUnits(subjectId, gradeYear as any, 5);
      refreshUnits();
      showSuccess('Unidades sugeridas com sucesso!');
    } catch (error: any) {
      showError(error.message || 'Erro ao sugerir unidades');
    } finally {
      setSuggesting(false);
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

  const handleGenerateLessonPlan = async (unitId: string) => {
    try {
      const service = getLessonPlanService();
      await service.generateLessonPlanForUnit(unitId);
      refreshUnits();
      showSuccess('Plano de aula gerado com sucesso!');
    } catch (error: any) {
      showError(error.message || 'Erro ao gerar plano de aula');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!subject) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-gray-50">
        {/* Header Moderno */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-600 shadow-xl border-b border-primary-700/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <BackButton href="/professor" className="bg-white/20 hover:bg-white/30 text-white border-white/30" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <span className="text-5xl">📚</span>
                  <span>{subject.name}</span>
                </h1>
                {subject.description && (
                  <p className="text-primary-100 text-lg">{subject.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <PageContainer>
          {/* Ações Rápidas */}
          {canEdit && (
            <div className="flex flex-wrap gap-4 mb-8">
              <Link href={`/professor/unidades/new?subjectId=${subjectId}`}>
                <Button className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  <span className="mr-2">➕</span>
                  Nova Unidade
                </Button>
              </Link>
              <Button
                variant="success"
                onClick={handleSuggestUnits}
                disabled={suggesting}
                className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                {suggesting ? (
                  <>
                    <span className="mr-2">⏳</span>
                    Sugerindo...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🤖</span>
                    Sugerir Unidades (IA)
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Seção de Unidades */}
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200 transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 px-6 py-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📖</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Unidades de Ensino
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {units.length} {units.length === 1 ? 'unidade cadastrada' : 'unidades cadastradas'}
                  </p>
                </div>
              </div>
            </div>
            {units.length === 0 ? (
              <div className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <span className="text-5xl">📚</span>
                  </div>
                  <EmptyState
                    title="Nenhuma unidade cadastrada ainda"
                    description="Crie manualmente ou use a IA para sugerir unidades"
                    action={
                      canEdit && (
                        <div className="flex gap-4 justify-center mt-6">
                          <Link href={`/professor/unidades/new?subjectId=${subjectId}`}>
                            <Button>
                              <span className="mr-2">➕</span>
                              Nova Unidade
                            </Button>
                          </Link>
                          <Button
                            variant="success"
                            onClick={handleSuggestUnits}
                            disabled={suggesting}
                          >
                            {suggesting ? '⏳ Sugerindo...' : '🤖 Sugerir Unidades (IA)'}
                          </Button>
                        </div>
                      )
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="p-6">
                <UnitsList
                  units={units}
                  canGenerate={canEdit}
                  onGenerate={handleGenerateLessonPlan}
                  canDelete={canEdit}
                  onDelete={handleDeleteUnit}
                  emptyStateTitle="Nenhuma unidade cadastrada ainda"
                  emptyStateDescription="Crie manualmente ou use a IA para sugerir unidades"
                />
              </div>
            )}
          </div>
        </PageContainer>
      </div>
    </ProtectedRoute>
  );
}
