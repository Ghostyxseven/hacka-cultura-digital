// src/app/(dashboards)/aluno/disciplinas/[id]/page.tsx
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
import { EmptyState, BackButton } from '@/components';
import { UnitsList } from '@/app/components';
import { showError } from '@/utils/notifications';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AlunoSubjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const subjectId = params.id as string;
  const { isAluno } = useAuth();
  const [subject, setSubject] = useState<SubjectViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const { units, refresh: refreshUnits } = useUnits(subjectId);

  useEffect(() => {
    const service = getLessonPlanService();

    try {
      const foundSubjectEntity = service.getSubjectById(subjectId);
      const foundSubject = foundSubjectEntity ? PresentationMapper.toSubjectViewModel(foundSubjectEntity) : undefined;

      if (!foundSubject) {
        router.push('/aluno');
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

  if (!isAluno) {
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

  if (!subject) {
    return null;
  }

  // Filtra apenas unidades com planos de aula
  const unitsWithPlans = units.filter(u => u.lessonPlanId);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        {/* Header Moderno */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-xl border-b border-blue-700/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <BackButton href="/aluno" className="bg-white/20 hover:bg-white/30 text-white border-white/30" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <span className="text-5xl">📚</span>
                  <span>{subject.name}</span>
                </h1>
                {subject.description && (
                  <p className="text-blue-100 text-lg">{subject.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <PageContainer>
          {unitsWithPlans.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <span className="text-5xl">📖</span>
                </div>
                <EmptyState
                  title="Nenhum plano de aula disponível para esta disciplina"
                  description="Aguarde seu professor gerar planos de aula para as unidades desta disciplina"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200 transition-all duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 px-6 py-5 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📖</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Planos de Aula Disponíveis
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {unitsWithPlans.length} {unitsWithPlans.length === 1 ? 'plano de aula disponível' : 'planos de aula disponíveis'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <UnitsList
                  units={unitsWithPlans}
                  subjects={[subject]}
                  showSubject={false}
                  emptyStateTitle="Nenhum plano de aula disponível"
                  emptyStateDescription="Aguarde seu professor gerar planos de aula"
                />
              </div>
            </div>
          )}
        </PageContainer>
      </div>
    </ProtectedRoute>
  );
}
