// src/app/(dashboards)/professor/unidades/[unitId]/plano/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getLessonPlanService } from '@/lib/service';
import { PresentationMapper } from '@/application';
import type { LessonPlanViewModel, UnitViewModel } from '@/application/viewmodels';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { Button, BackButton } from '@/components';
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
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [generatingSlides, setGeneratingSlides] = useState(false);
  const lessonPlanService = getLessonPlanService();

  useEffect(() => {
    loadData();
  }, [unitId]);

  const loadData = () => {
    try {
      const foundUnitEntity = lessonPlanService.getUnitById(unitId);
      const foundUnit = foundUnitEntity ? PresentationMapper.toUnitViewModel(foundUnitEntity) : undefined;
      if (!foundUnit) {
        showError('Unidade não encontrada');
        router.push('/professor');
        return;
      }

      setUnit(foundUnit);

      if (foundUnit.lessonPlanId) {
        const planEntity = lessonPlanService.getLessonPlanById(foundUnit.lessonPlanId);
        const plan = planEntity ? PresentationMapper.toLessonPlanViewModel(planEntity) : undefined;
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
      await lessonPlanService.generateLessonPlanForUnit(unitId);
      loadData();
      showSuccess('Plano de aula gerado com sucesso!');
    } catch (error: any) {
      showError(error.message || 'Erro ao gerar plano de aula');
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateProvaPDF = async () => {
    if (!lessonPlan) return;

    setGeneratingPDF(true);
    try {
      const response = await fetch('/api/pdf/prova', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonPlanId: lessonPlan.id,
          options: {
            schoolName: 'INSTITUTO FEDERAL DO PIAUÍ - IFPI',
            includeAnswers: false, // Prova sem gabarito
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prova-${lessonPlan.title.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showSuccess('PDF de prova gerado com sucesso!');
    } catch (error: any) {
      showError(error.message || 'Erro ao gerar PDF de prova');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleGenerateSlidesPDF = async () => {
    if (!lessonPlan) return;

    setGeneratingSlides(true);
    try {
      const response = await fetch('/api/pdf/slides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonPlanId: lessonPlan.id,
          options: {
            schoolName: 'INSTITUTO FEDERAL DO PIAUÍ - IFPI',
            includeQuiz: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `slides-${lessonPlan.title.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showSuccess('PDF de slides gerado com sucesso!');
    } catch (error: any) {
      showError(error.message || 'Erro ao gerar PDF de slides');
    } finally {
      setGeneratingSlides(false);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-gray-50">
        {/* Header Moderno */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 shadow-xl border-b border-indigo-700/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <BackButton href={backHref} className="bg-white/20 hover:bg-white/30 text-white border-white/30" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <span className="text-5xl">📖</span>
                  <span>Plano de Aula: {unit.topic}</span>
                </h1>
                <p className="text-indigo-100 text-lg">Detalhes do plano de aula gerado por IA</p>
              </div>
            </div>
          </div>
        </div>

        <PageContainer maxWidth="md">
          {!lessonPlan ? (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center hover:shadow-2xl transition-all duration-300">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <span className="text-5xl">📚</span>
                </div>
                <EmptyState
                  title="Nenhum plano de aula gerado para esta unidade ainda"
                  description={canGenerate ? "Clique no botão abaixo para gerar um plano de aula completo usando IA" : "Aguarde o professor gerar o plano de aula"}
                  action={
                    canGenerate ? (
                      <Button 
                        onClick={handleGenerate} 
                        disabled={generating}
                        className="mt-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                      >
                        {generating ? (
                          <>
                            <span className="mr-2">⏳</span>
                            Gerando...
                          </>
                        ) : (
                          <>
                            <span className="mr-2">🤖</span>
                            Gerar Plano de Aula com IA
                          </>
                        )}
                      </Button>
                    ) : null
                  }
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Card Principal do Plano */}
              <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-2xl shadow-2xl p-6 text-white">
                <h2 className="text-3xl font-bold mb-4">{lessonPlan.title}</h2>
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold border border-white/30">
                    📚 {lessonPlan.subject}
                  </span>
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold border border-white/30">
                    {lessonPlan.gradeYear}
                  </span>
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold border border-white/30">
                    ⏱️ {lessonPlan.duration}
                  </span>
                </div>
                
                {/* Botões de Exportação */}
                {canGenerate && (
                  <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/20">
                    <Button
                      onClick={handleGenerateProvaPDF}
                      disabled={generatingPDF}
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                    >
                      {generatingPDF ? (
                        <>
                          <span className="mr-2">⏳</span>
                          Gerando...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">📄</span>
                          Gerar Prova PDF
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleGenerateSlidesPDF}
                      disabled={generatingSlides}
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                    >
                      {generatingSlides ? (
                        <>
                          <span className="mr-2">⏳</span>
                          Gerando...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">📊</span>
                          Gerar Slides PDF
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Objetivos */}
              {lessonPlan.objectives && lessonPlan.objectives.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🎯</span>
                    <h3 className="text-2xl font-bold text-gray-900">Objetivos de Aprendizagem</h3>
                  </div>
                  <ul className="space-y-3">
                    {lessonPlan.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <span className="text-primary-600 font-bold text-xl mt-0.5">•</span>
                        <span className="text-gray-700 leading-relaxed">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Competências BNCC */}
              {lessonPlan.bnccCompetencies && lessonPlan.bnccCompetencies.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">✅</span>
                    <h3 className="text-2xl font-bold text-gray-900">Competências BNCC</h3>
                  </div>
                  <ul className="space-y-3">
                    {lessonPlan.bnccCompetencies.map((competency, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                        <span className="text-green-600 font-bold text-xl mt-0.5">✓</span>
                        <span className="text-gray-700 leading-relaxed">{competency}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Metodologia */}
              {lessonPlan.methodology && (
                <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">📝</span>
                    <h3 className="text-2xl font-bold text-gray-900">Metodologia</h3>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{lessonPlan.methodology}</p>
                  </div>
                </div>
              )}

              {/* Conteúdo */}
              {lessonPlan.content && (
                <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">📚</span>
                    <h3 className="text-2xl font-bold text-gray-900">Conteúdo</h3>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{lessonPlan.content}</p>
                  </div>
                </div>
              )}

              {/* Atividade Avaliativa */}
              {lessonPlan.quiz && lessonPlan.quiz.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">✏️</span>
                    <h3 className="text-2xl font-bold text-gray-900">Atividade Avaliativa</h3>
                  </div>
                  <div className="space-y-6">
                    {lessonPlan.quiz.map((question, index) => (
                      <div key={question.id} className="border-l-4 border-primary-500 pl-6 py-4 bg-gradient-to-r from-primary-50/50 to-transparent rounded-r-xl">
                        <div className="flex items-start gap-3 mb-4">
                          <span className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                            {index + 1}
                          </span>
                          <p className="font-semibold text-gray-900 text-lg leading-relaxed">{question.question}</p>
                        </div>
                        <ul className="space-y-2 mb-4 ml-11">
                          {question.options.map((option, optIndex) => (
                            <li
                              key={optIndex}
                              className={`p-3 rounded-xl transition-all ${
                                optIndex === question.correctAnswer
                                  ? 'bg-green-50 border-2 border-green-300 text-green-800 shadow-md'
                                  : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>
                                  <span className="font-bold mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                                  {option}
                                </span>
                                {optIndex === question.correctAnswer && (
                                  <span className="text-green-700 font-bold text-lg">✓</span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div className="ml-11 bg-blue-50 p-4 rounded-xl text-sm text-blue-800 border border-blue-200">
                          <strong className="text-blue-900">💡 Justificativa:</strong>
                          <p className="mt-1 text-blue-700 leading-relaxed">{question.justification}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadados */}
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl p-6 text-sm text-gray-600 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🤖</span>
                  <p><strong>Gerado por:</strong> {lessonPlan.metadata.aiModel}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">📋</span>
                  <p><strong>Versão do prompt:</strong> {lessonPlan.metadata.promptVersion}</p>
                </div>
              </div>
            </div>
          )}
        </PageContainer>
      </div>
    </ProtectedRoute>
  );
}
