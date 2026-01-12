// src/app/units/plan/[unitId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getLessonPlanService } from '@/lib/service';
import type { LessonPlanViewModel, UnitViewModel } from '@/app/types';
import { HeaderWithAuth } from '@/components/layout/HeaderWithAuth';
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

  useEffect(() => {
    const service = getLessonPlanService();
    
    try {
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

  const backHref = canGenerate ? `/subjects/${unit.subjectId}` : '/aluno';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-primary-50 to-white shadow-md border-b border-gray-200 p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Plano de Aula: {unit.topic}</h2>
          <p className="text-gray-600">Visualize o plano de aula completo desta unidade</p>
        </div>

        <PageContainer maxWidth="md">
          {!lessonPlan ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center hover:shadow-xl transition-all duration-200">
              <EmptyState
                title="Nenhum plano de aula gerado para esta unidade ainda."
                action={
                  canGenerate ? (
                    <Button onClick={handleGenerate} disabled={generating} className="mt-4">
                      {generating ? '⏳ Gerando...' : '🤖 Gerar Plano de Aula com IA'}
                    </Button>
                  ) : (
                    <p className="text-gray-500 mt-4">Aguarde o professor gerar o plano de aula.</p>
                  )
                }
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl shadow-lg border border-primary-200 p-6 hover:shadow-xl transition-all duration-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{lessonPlan.title}</h2>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 text-gray-700 font-medium border border-primary-200">
                    📚 {lessonPlan.subject}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 text-gray-700 font-medium border border-primary-200">
                    🎓 {lessonPlan.gradeYear}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 text-gray-700 font-medium border border-primary-200">
                    ⏱️ {lessonPlan.duration}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-primary-600">🎯</span>
                  Objetivos de Aprendizagem
                </h3>
                <ul className="space-y-3">
                  {lessonPlan.objectives.map((obj, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold mt-0.5">
                        {index + 1}
                      </span>
                      <span className="flex-1">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-green-600">📋</span>
                  Competências BNCC
                </h3>
                <ul className="space-y-3">
                  {lessonPlan.bnccCompetencies.map((comp, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold mt-0.5">
                        ✓
                      </span>
                      <span className="flex-1">{comp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-600">📖</span>
                  Metodologia
                </h3>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-200">
                  {lessonPlan.methodology}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-purple-600">📚</span>
                  Conteúdo
                </h3>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-200">
                  {lessonPlan.content}
                </div>
              </div>

              {lessonPlan.quiz && lessonPlan.quiz.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="text-yellow-600">✏️</span>
                    Atividade Avaliativa
                  </h3>
                  <div className="space-y-6">
                    {lessonPlan.quiz.map((question, index) => (
                      <div key={question.id} className="border-l-4 border-primary-500 bg-gray-50 rounded-r-xl p-5 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start gap-3 mb-4">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <p className="font-semibold text-gray-900 text-lg flex-1">
                            {question.question}
                          </p>
                        </div>
                        <ul className="space-y-2 mb-4 ml-11">
                          {question.options.map((option, optIndex) => (
                            <li
                              key={optIndex}
                              className={`p-3 rounded-lg transition-all duration-200 ${
                                optIndex === question.correctAnswer
                                  ? 'bg-green-100 border-2 border-green-400 shadow-sm'
                                  : 'bg-white border border-gray-200 hover:border-primary-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">
                                  <span className="font-bold text-primary-600 mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                                  {option}
                                </span>
                                {optIndex === question.correctAnswer && (
                                  <span className="flex items-center gap-1 text-green-700 font-bold text-sm bg-green-200 px-2 py-1 rounded-full">
                                    <span>✓</span>
                                    <span>Correta</span>
                                  </span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg ml-11">
                          <strong className="text-blue-900 block mb-1">💡 Justificativa:</strong>
                          <p className="text-sm text-gray-700">{question.justification}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-5 text-sm text-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-primary-600">🤖</span>
                  <p className="font-semibold text-gray-700">Gerado por: {lessonPlan.metadata.aiModel}</p>
                </div>
                <p className="text-gray-600">Versão do prompt: {lessonPlan.metadata.promptVersion}</p>
              </div>
            </div>
          )}
        </PageContainer>
      </div>
    </ProtectedRoute>
  );
}
