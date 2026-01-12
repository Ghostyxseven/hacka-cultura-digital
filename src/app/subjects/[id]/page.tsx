// src/app/subjects/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getLessonPlanService } from '@/lib/service';
import type { SubjectViewModel } from '@/app/types';
import { useUnits } from '@/hooks/useUnits';
import { HeaderWithAuth } from '@/components/layout/HeaderWithAuth';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
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
      const foundSubject = service.getSubjectByIdViewModel(subjectId);
      
      if (!foundSubject) {
        router.push('/');
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
      await service.suggestUnitsViewModels(subjectId, gradeYear as any, 5);
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
      await service.generateLessonPlanForUnitViewModel(unitId);
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

  const backHref = canEdit ? '/professor' : '/aluno';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <HeaderWithAuth
          title={subject.name}
          subtitle={subject.description}
          backHref={backHref}
        />

        <PageContainer>
          {canEdit && (
            <div className="flex gap-4 mb-6">
              <Link href={`/units/new?subjectId=${subjectId}`}>
                <Button>➕ Nova Unidade</Button>
              </Link>
              <Button
                variant="success"
                onClick={handleSuggestUnits}
                disabled={suggesting}
              >
                {suggesting ? 'Sugerindo...' : '🤖 Sugerir Unidades (IA)'}
              </Button>
            </div>
          )}

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Unidades de Ensino ({units.length})
              </h2>
            </div>
            <div className="p-6">
              <UnitsList
                units={units}
                canGenerate={canEdit}
                onGenerate={handleGenerateLessonPlan}
                canDelete={canEdit}
                onDelete={handleDeleteUnit}
                emptyStateTitle="Nenhuma unidade cadastrada ainda."
                emptyStateDescription="Crie manualmente ou use a IA para sugerir unidades."
              />
            </div>
          </div>
        </PageContainer>
      </div>
    </ProtectedRoute>
  );
}
