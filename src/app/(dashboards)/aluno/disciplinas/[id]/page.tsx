// src/app/(dashboards)/aluno/disciplinas/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getLessonPlanService } from '@/lib/service';
import type { SubjectViewModel } from '@/app/types';
import { useUnits } from '@/hooks/useUnits';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
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
      const foundSubject = service.getSubjectByIdViewModel(subjectId);
      
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
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-primary-50 to-white shadow-md border-b border-gray-200 p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{subject.name}</h2>
          {subject.description && (
            <p className="text-gray-600">{subject.description}</p>
          )}
        </div>

        <PageContainer>
          {unitsWithPlans.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
              <EmptyState
                title="Nenhum plano de aula disponível para esta disciplina"
                description="Aguarde seu professor gerar planos de aula para as unidades desta disciplina"
              />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-200">
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">
                  Planos de Aula Disponíveis ({unitsWithPlans.length})
                </h2>
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
