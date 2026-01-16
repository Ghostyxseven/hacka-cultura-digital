// src/app/(dashboards)/aluno/unidades/[unitId]/plano/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getLessonPlanService } from '@/lib/service';
import { PresentationMapper } from '@/application';
import type { LessonPlanViewModel, UnitViewModel } from '@/application/viewmodels';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { EmptyState, BackButton, Button } from '@/components';
import { LazyTutorChat } from '@/components/lazy';
import { showError, showSuccess } from '@/utils/notifications';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AlunoLessonPlanPage() {
  const router = useRouter();
  const params = useParams();
  const unitId = params.unitId as string;
  const { isAluno } = useAuth();

  const [unit, setUnit] = useState<UnitViewModel | null>(null);
  const [lessonPlan, setLessonPlan] = useState<LessonPlanViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [generatingSlides, setGeneratingSlides] = useState(false);
  const lessonPlanService = getLessonPlanService();

  useEffect(() => {
    if (!isAluno) {
      router.push('/aluno');
      return;
    }
    loadData();
  }, [unitId, isAluno, router]);

  const loadData = () => {
    try {
      const foundUnitEntity = lessonPlanService.getUnitById(unitId);
      const foundUnit = foundUnitEntity ? PresentationMapper.toUnitViewModel(foundUnitEntity) : undefined;
      if (!foundUnit) {
        showError('Unidade não encontrada');
        router.push('/aluno');
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

  const handleGenerateProvaPDF = async () => {
    if (!lessonPlan) return;

    setGeneratingPDF(true);
    try {
      // Busca a entidade completa do plano de aula
      const planEntity = lessonPlanService.getLessonPlanById(lessonPlan.id);
      if (!planEntity) {
        throw new Error('Plano de aula não encontrado');
      }

      const response = await fetch('/api/pdf/prova', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonPlan: planEntity,
          options: {
            schoolName: 'INSTITUTO FEDERAL DO PIAUÍ - IFPI',
            includeAnswers: false, // Prova sem gabarito para alunos
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao gerar PDF da prova');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prova-${lessonPlan.title.replace(/\s+/g, '-').toLowerCase()}-${lessonPlan.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showSuccess('PDF da prova gerado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao gerar PDF da prova:', error);
      showError(error.message || 'Erro ao gerar PDF da prova');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleGenerateSlidesPDF = async () => {
    if (!lessonPlan) return;

    setGeneratingSlides(true);
    try {
      // Busca a entidade completa do plano de aula
      const planEntity = lessonPlanService.getLessonPlanById(lessonPlan.id);
      if (!planEntity) {
        throw new Error('Plano de aula não encontrado');
      }

      const response = await fetch('/api/pdf/slides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonPlan: planEntity,
          options: {
            schoolName: 'INSTITUTO FEDERAL DO PIAUÍ - IFPI',
            includeQuiz: true,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao gerar PDF dos slides');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `slides-${lessonPlan.title.replace(/\s+/g, '-').toLowerCase()}-${lessonPlan.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showSuccess('PDF dos slides gerado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao gerar PDF dos slides:', error);
      showError(error.message || 'Erro ao gerar PDF dos slides');
    } finally {
      setGeneratingSlides(false);
    }
  };

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

  if (!unit) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header Limpo */}
        <div className="bg-surface border-b border-border shadow-sm sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <BackButton href="/aluno" className="bg-secondary/20 hover:bg-secondary/30 text-text-main border-border" />
                <div>
                  <h1 className="text-2xl font-bold text-text-main font-heading flex items-center gap-3">
                    <span className="text-3xl">📖</span>
                    <span>Plano de Aula: {unit.topic}</span>
                  </h1>
                  <p className="text-sm text-text-secondary mt-1">Visualize o plano de aula do seu professor</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <PageContainer maxWidth="md" className="py-8">
          {!lessonPlan ? (
            <div className="bg-surface rounded-2xl shadow-sm border border-border p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/20 flex items-center justify-center">
                  <span className="text-4xl">📚</span>
                </div>
                <EmptyState
                  title="Nenhum plano de aula disponível para esta unidade"
                  description="Aguarde seu professor gerar o plano de aula"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Card Principal do Plano */}
              <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-border">
                  <h2 className="text-2xl font-bold text-text-main font-heading mb-3">{lessonPlan.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
                      📚 {lessonPlan.subject}
                    </span>
                    <span className="px-3 py-1.5 bg-secondary/20 text-secondary-foreground rounded-full text-sm font-medium border border-border">
                      {lessonPlan.gradeYear}
                    </span>
                    <span className="px-3 py-1.5 bg-secondary/20 text-secondary-foreground rounded-full text-sm font-medium border border-border">
                      ⏱️ {lessonPlan.duration}
                    </span>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {lessonPlan.quiz && lessonPlan.quiz.length > 0 && (
                      <Button
                        onClick={() => router.push(`/aluno/quiz/${lessonPlan.id}`)}
                        className="bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all"
                      >
                        <span className="mr-2">✏️</span>
                        Fazer Quiz
                      </Button>
                    )}
                    <Button
                      onClick={handleGenerateProvaPDF}
                      disabled={generatingPDF}
                      variant="secondary"
                      className="border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
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
                      className="border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
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
                </div>
              </div>

              {/* Objetivos */}
              {lessonPlan.objectives && lessonPlan.objectives.length > 0 && (
                <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
                  <div className="px-6 py-4 border-b border-border bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎯</span>
                      <h3 className="text-lg font-bold text-text-main font-heading">Objetivos de Aprendizagem</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      {lessonPlan.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                          <span className="text-primary font-bold text-lg mt-0.5 flex-shrink-0">•</span>
                          <span className="text-text-main leading-relaxed">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Competências BNCC */}
              {lessonPlan.bnccCompetencies && lessonPlan.bnccCompetencies.length > 0 && (
                <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
                  <div className="px-6 py-4 border-b border-border bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✅</span>
                      <h3 className="text-lg font-bold text-text-main font-heading">Competências BNCC</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      {lessonPlan.bnccCompetencies.map((competency, index) => (
                        <li key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                          <span className="text-green-600 font-bold text-lg mt-0.5 flex-shrink-0">✓</span>
                          <span className="text-text-main leading-relaxed">{competency}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Metodologia */}
              {lessonPlan.methodology && (
                <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
                  <div className="px-6 py-4 border-b border-border bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📝</span>
                      <h3 className="text-lg font-bold text-text-main font-heading">Metodologia</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="bg-secondary/5 rounded-xl p-4 border border-border">
                      <p className="text-text-main whitespace-pre-line leading-relaxed">{lessonPlan.methodology}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Conteúdo */}
              {lessonPlan.content && (
                <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
                  <div className="px-6 py-4 border-b border-border bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📚</span>
                      <h3 className="text-lg font-bold text-text-main font-heading">Conteúdo</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="bg-secondary/5 rounded-xl p-4 border border-border">
                      <p className="text-text-main whitespace-pre-line leading-relaxed">{lessonPlan.content}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Atividade Avaliativa */}
              {lessonPlan.quiz && lessonPlan.quiz.length > 0 && (
                <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
                  <div className="px-6 py-4 border-b border-border bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✏️</span>
                      <h3 className="text-lg font-bold text-text-main font-heading">Atividade Avaliativa</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {lessonPlan.quiz.map((question, index) => (
                        <div key={question.id} className="border-l-4 border-primary pl-6 py-4 bg-primary/5 rounded-r-xl">
                          <div className="flex items-start gap-3 mb-4">
                            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0 text-sm">
                              {index + 1}
                            </span>
                            <p className="font-semibold text-text-main leading-relaxed">{question.question}</p>
                          </div>
                          <ul className="space-y-2 ml-11">
                            {question.options.map((option, optIndex) => (
                              <li
                                key={optIndex}
                                className="p-3 rounded-xl bg-surface border border-border text-text-main hover:bg-secondary/5 transition-all"
                              >
                                <span className="font-bold mr-2 text-primary">{String.fromCharCode(65 + optIndex)}.</span>
                                {option}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-primary/10 rounded-xl border border-primary/20">
                      <p className="text-sm text-primary text-center">
                        💡 Responda as questões acessando o quiz interativo através do botão acima.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Materiais de Apoio (Fase 4) */}
              {lessonPlan.supportMaterials && lessonPlan.supportMaterials.length > 0 && (
                <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
                  <div className="px-6 py-4 border-b border-border bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔗</span>
                      <h3 className="text-lg font-bold text-text-main font-heading">Materiais de Apoio</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lessonPlan.supportMaterials.map((material, idx) => (
                        <div key={idx} className="p-4 border border-border rounded-xl hover:bg-secondary/5 transition-all flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">
                              {material.type === 'slide' ? '📊' : material.type === 'video' ? '🎬' : '🔗'}
                            </span>
                            <h4 className="font-bold text-text-main">{material.title}</h4>
                          </div>
                          {material.type === 'slide' && material.slides && (
                            <div className="text-xs text-text-secondary">
                              <p className="font-semibold mb-1">Guia de estudo:</p>
                              <ul className="list-disc ml-4 space-y-1">
                                {material.slides.slice(0, 3).map((s, i) => (
                                  <li key={i}>{s.title}</li>
                                ))}
                                {material.slides.length > 3 && <li>... e outros {material.slides.length - 3} tópicos</li>}
                              </ul>
                            </div>
                          )}
                          {material.url && (
                            <a
                              href={material.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm font-medium flex items-center gap-1 mt-auto"
                            >
                              Acessar Conteúdo ↗
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Metadados */}
              <div className="bg-secondary/10 rounded-2xl p-6 text-sm text-text-secondary border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">🤖</span>
                  <p><strong className="text-text-main">Gerado por:</strong> {lessonPlan.metadata.aiModel}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">📋</span>
                  <p><strong className="text-text-main">Versão do prompt:</strong> {lessonPlan.metadata.promptVersion}</p>
                </div>
              </div>
            </div>
          )}
        </PageContainer>

        {lessonPlan && <LazyTutorChat lessonPlan={lessonPlan} />}
      </div>
    </ProtectedRoute>
  );
}
