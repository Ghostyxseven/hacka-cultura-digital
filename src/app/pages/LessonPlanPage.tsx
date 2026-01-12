// src/app/pages/LessonPlanPage.tsx
// Componente de página para Visualização do Plano de Aula
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLessonPlanService } from '@/lib/service';
import type { LessonPlanViewModel, UnitViewModel } from '@/app/types';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { showError, showSuccess } from '@/utils/notifications';

interface LessonPlanPageProps {
  unitId: string;
}

export function LessonPlanPage({ unitId }: LessonPlanPageProps) {
  const router = useRouter();
  const { isProfessor, isAdmin } = useAuth();
  const canGenerate = isProfessor || isAdmin;
  const [unit, setUnit] = useState<UnitViewModel | null>(null);
  const [lessonPlan, setLessonPlan] = useState<LessonPlanViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const service = getLessonPlanService();
    
    try {
      // Usa método do serviço que retorna ViewModel (sem lógica de negócio na página)
      const foundUnit = service.getUnitByIdViewModel(unitId);
      
      if (!foundUnit) {
        router.push('/');
        return;
      }
      
      setUnit(foundUnit);
      
      if (foundUnit.lessonPlanId) {
        const plan = service.getLessonPlanByIdViewModel(foundUnit.lessonPlanId);
        setLessonPlan(plan || null);
      }
    } catch (error) {
      console.error('Erro ao carregar plano de aula:', error);
      showError('Erro ao carregar plano de aula');
    } finally {
      setLoading(false);
    }
  }, [unitId, router]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const service = getLessonPlanService();
      const plan = await service.generateLessonPlanForUnitViewModel(unitId);
      setLessonPlan(plan);
      showSuccess('Plano de aula gerado com sucesso!');
    } catch (error: any) {
      showError(error.message || 'Erro ao gerar plano de aula');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!unit) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={`Plano de Aula: ${unit.topic}`}
        backHref={`/subjects/${unit.subjectId}`}
      />

      <PageContainer maxWidth="md">
        {!lessonPlan ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <EmptyState
              title="Nenhum plano de aula gerado para esta unidade ainda."
              action={
                canGenerate ? (
                  <Button onClick={handleGenerate} disabled={generating}>
                    {generating ? 'Gerando...' : '🤖 Gerar Plano de Aula com IA'}
                  </Button>
                ) : (
                  <p className="text-gray-500">Aguarde o professor gerar o plano de aula.</p>
                )
              }
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cabeçalho */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{lessonPlan.title}</h2>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>Disciplina: {lessonPlan.subject}</span>
                <span>•</span>
                <span>{lessonPlan.gradeYear}</span>
                <span>•</span>
                <span>{lessonPlan.duration}</span>
              </div>
            </div>

            {/* Objetivos */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Objetivos de Aprendizagem</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {lessonPlan.objectives.map((obj, index) => (
                  <li key={index}>{obj}</li>
                ))}
              </ul>
            </div>

            {/* Competências BNCC */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Competências BNCC</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {lessonPlan.bnccCompetencies.map((comp, index) => (
                  <li key={index}>{comp}</li>
                ))}
              </ul>
            </div>

            {/* Metodologia */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Metodologia</h3>
              <div className="text-gray-700 whitespace-pre-line">{lessonPlan.methodology}</div>
            </div>

            {/* Conteúdo */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Conteúdo</h3>
              <div className="text-gray-700 whitespace-pre-line">{lessonPlan.content}</div>
            </div>

            {/* Quiz/Atividade */}
            {lessonPlan.quiz && lessonPlan.quiz.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Atividade Avaliativa
                </h3>
                <div className="space-y-6">
                  {lessonPlan.quiz.map((question, index) => (
                    <div key={question.id} className="border-l-4 border-primary-500 pl-4">
                      <p className="font-medium text-gray-900 mb-3">
                        {index + 1}. {question.question}
                      </p>
                      <ul className="space-y-2 mb-3">
                        {question.options.map((option, optIndex) => (
                          <li
                            key={optIndex}
                            className={`p-2 rounded ${
                              optIndex === question.correctAnswer
                                ? 'bg-green-100 border border-green-300'
                                : 'bg-gray-50'
                            }`}
                          >
                            {String.fromCharCode(65 + optIndex)}. {option}
                            {optIndex === question.correctAnswer && (
                              <span className="ml-2 text-green-700 font-semibold">✓ Correta</span>
                            )}
                          </li>
                        ))}
                      </ul>
                      <div className="bg-blue-50 p-3 rounded text-sm text-gray-700">
                        <strong>Justificativa:</strong> {question.justification}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadados */}
            <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-600">
              <p>Gerado por: {lessonPlan.metadata.aiModel}</p>
              <p>Versão do prompt: {lessonPlan.metadata.promptVersion}</p>
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
