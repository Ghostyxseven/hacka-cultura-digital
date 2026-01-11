// src/app/pages/SubjectDetailPage.tsx
// Componente de página para Detalhes da Disciplina
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLessonPlanService } from '@/lib/service';
import type { SubjectViewModel } from '@/app/types';
import { useUnits } from '@/hooks/useUnits';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { showError, showSuccess } from '@/utils/notifications';
import Link from 'next/link';

interface SubjectDetailPageProps {
  subjectId: string;
}

export function SubjectDetailPage({ subjectId }: SubjectDetailPageProps) {
  const router = useRouter();
  const [subject, setSubject] = useState<SubjectViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [suggesting, setSuggesting] = useState(false);
  const { units, refresh: refreshUnits } = useUnits(subjectId);

  useEffect(() => {
    const service = getLessonPlanService();
    
    try {
      // Usa método do serviço que retorna ViewModel (sem lógica de negócio na página)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={subject.name}
        subtitle={subject.description}
        backHref="/"
      />

      <PageContainer>
        {/* Ações */}
        <div className="flex gap-4 mb-6">
          <Link href={`/subjects/${subjectId}/units/new`}>
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

        {/* Unidades */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Unidades de Ensino ({units.length})
            </h2>
          </div>
          <div className="p-6">
            {units.length === 0 ? (
              <EmptyState
                title="Nenhuma unidade cadastrada ainda."
                description="Crie manualmente ou use a IA para sugerir unidades."
              />
            ) : (
              <div className="space-y-4">
                {units.map((unit) => (
                  <div
                    key={unit.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{unit.topic}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {unit.gradeYear} • {unit.isSuggestedByAI ? '🤖 Sugerida por IA' : '✍️ Criada manualmente'}
                        </p>
                        {unit.description && (
                          <p className="text-sm text-gray-500 mt-2">{unit.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        {!unit.lessonPlanId && (
                          <Button
                            onClick={() => handleGenerateLessonPlan(unit.id)}
                            className="text-sm"
                          >
                            Gerar Plano
                          </Button>
                        )}
                        {unit.lessonPlanId && (
                          <Link href={`/units/${unit.id}/lesson-plan`}>
                            <Button variant="success" className="text-sm">
                              Ver Plano
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
