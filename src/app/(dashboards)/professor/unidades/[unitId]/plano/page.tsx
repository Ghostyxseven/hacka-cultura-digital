// src/app/(dashboards)/professor/unidades/[unitId]/plano/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getLessonPlanService } from '@/lib/service';
import type { LessonPlanViewModel, UnitViewModel } from '@/app/types';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { showError, showSuccess } from '@/utils/notifications';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function LessonPlanPage() {
  const router = useRouter();
  const params = useParams();
  const unitId = params.unitId as string;
  const { isProfessor, isAdmin } = useAuth();
  const canGenerate = isProfessor || isAdmin;
  
  const [unit, setUnit] = useState<UnitViewModel | null>(null);
  const [lessonPlan, setLessonPlan] = useState<LessonPlanViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const lessonPlanService = getLessonPlanService();

  useEffect(() => {
    loadData();
  }, [unitId]);

  const loadData = () => {
    try {
      const foundUnit = lessonPlanService.getUnitByIdViewModel(unitId);
      if (!foundUnit) {
        showError('Unidade não encontrada');
        router.push('/professor');
        return;
      }
      
      setUnit(foundUnit);
      
      if (foundUnit.lessonPlanId) {
        const plan = lessonPlanService.getLessonPlanByIdViewModel(foundUnit.lessonPlanId);
        setLessonPlan(plan || null);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      showError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!unit) return;
    
    setGenerating(true);
    try {
      await lessonPlanService.generateLessonPlanForUnitViewModel(unitId);
      loadData();
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

  const backHref = canGenerate ? `/professor/disciplinas/${unit.subjectId}` : '/aluno';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-primary-50 to-white shadow-md border-b border-gray-200 p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Plano de Aula: {unit.topic}</h2>
          <p className="text-gray-600">Detalhes do plano de aula gerado por IA</p>
        </div>

        <PageContainer maxWidth="md">
          {!lessonPlan ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center hover:shadow-xl transition-all duration-200">
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
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{lessonPlan.title}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">Disciplina: {lessonPlan.subject}</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">{lessonPlan.gradeYear}</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">{lessonPlan.duration}</span>
                </div>
              </div>

              {lessonPlan.objectives && lessonPlan.objectives.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Objetivos de Aprendizagem</h3>
                  <ul className="space-y-2">
                    {lessonPlan.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary-600 font-bold mt-1">•</span>
                        <span className="text-gray-700">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {lessonPlan.bnccCompetencies && lessonPlan.bnccCompetencies.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Competências BNCC</h3>
                  <ul className="space-y-2">
                    {lessonPlan.bnccCompetencies.map((competency, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 font-bold mt-1">✓</span>
                        <span className="text-gray-700">{competency}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {lessonPlan.methodology && (
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Metodologia</h3>
                  <p className="text-gray-700 whitespace-pre-line">{lessonPlan.methodology}</p>
                </div>
              )}

              {lessonPlan.content && (
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Conteúdo</h3>
                  <p className="text-gray-700 whitespace-pre-line">{lessonPlan.content}</p>
                </div>
              )}

              {lessonPlan.quiz && lessonPlan.quiz.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Atividade Avaliativa
                  </h3>
                  <div className="space-y-6">
                    {lessonPlan.quiz.map((question, index) => (
                      <div key={question.id} className="border-l-4 border-primary-500 pl-4 py-2">
                        <p className="font-medium text-gray-900 mb-3">
                          {index + 1}. {question.question}
                        </p>
                        <ul className="space-y-2 mb-3">
                          {question.options.map((option, optIndex) => (
                            <li
                              key={optIndex}
                              className={`p-2 rounded-lg ${
                                optIndex === question.correctAnswer
                                  ? 'bg-green-50 border border-green-300 text-green-800'
                                  : 'bg-gray-50 border border-gray-200 text-gray-700'
                              }`}
                            >
                              {String.fromCharCode(65 + optIndex)}. {option}
                              {optIndex === question.correctAnswer && (
                                <span className="ml-2 text-green-700 font-semibold">✓ Correta</span>
                              )}
                            </li>
                          ))}
                        </ul>
                        <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700 border border-blue-200">
                          <strong>Justificativa:</strong> {question.justification}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gray-100 rounded-xl p-4 text-sm text-gray-600 border border-gray-200">
                <p>Gerado por: {lessonPlan.metadata.aiModel}</p>
                <p>Versão do prompt: {lessonPlan.metadata.promptVersion}</p>
              </div>
            </div>
          )}
        </PageContainer>
      </div>
    </ProtectedRoute>
  );
}
