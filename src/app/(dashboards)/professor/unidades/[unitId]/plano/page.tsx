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
import { ConfirmDeleteButton } from '@/components/ui/ConfirmDeleteButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { showError, showSuccess } from '@/utils/notifications';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import type { QuizQuestionViewModel } from '@/application/viewmodels';

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
  const [editingQuiz, setEditingQuiz] = useState(false);
  const [editedQuiz, setEditedQuiz] = useState<QuizQuestionViewModel[]>([]);
  const [savingQuiz, setSavingQuiz] = useState(false);
  const [editingObjectives, setEditingObjectives] = useState(false);
  const [editedObjectives, setEditedObjectives] = useState<string[]>([]);
  const [editingMethodology, setEditingMethodology] = useState(false);
  const [editedMethodology, setEditedMethodology] = useState('');
  const [editingContent, setEditingContent] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [savingPlan, setSavingPlan] = useState(false);
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
        if (plan?.quiz) {
          setEditedQuiz([...plan.quiz]);
        }
        if (plan?.objectives) {
          setEditedObjectives([...plan.objectives]);
        }
        if (plan?.methodology) {
          setEditedMethodology(plan.methodology);
        }
        if (plan?.content) {
          setEditedContent(plan.content);
        }
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

  const handleStartEditQuiz = () => {
    if (lessonPlan?.quiz) {
      setEditedQuiz([...lessonPlan.quiz]);
      setEditingQuiz(true);
    }
  };

  const handleCancelEditQuiz = () => {
    if (lessonPlan?.quiz) {
      setEditedQuiz([...lessonPlan.quiz]);
    }
    setEditingQuiz(false);
  };

  const handleUpdateQuizQuestion = (questionId: string, field: keyof QuizQuestionViewModel, value: string | number | string[]) => {
    setEditedQuiz(prev => prev.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  const handleUpdateQuizOption = (questionId: string, optionIndex: number, value: string) => {
    setEditedQuiz(prev => prev.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleAddQuizQuestion = () => {
    const newQuestion: QuizQuestionViewModel = {
      id: `quiz-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      justification: '',
    };
    setEditedQuiz(prev => [...prev, newQuestion]);
  };

  const handleRemoveQuizQuestion = (questionId: string) => {
    setEditedQuiz(prev => prev.filter(q => q.id !== questionId));
  };

  const handleSaveQuiz = async () => {
    if (!lessonPlan) return;

    setSavingQuiz(true);
    try {
      // Busca a entidade completa do plano de aula
      const planEntity = lessonPlanService.getLessonPlanById(lessonPlan.id);
      if (!planEntity) {
        throw new Error('Plano de aula não encontrado');
      }

      // Atualiza o quiz na entidade
      const updatedPlan = {
        ...planEntity,
        quiz: editedQuiz,
      };

      // Salva o plano de aula atualizado
      lessonPlanService.saveLessonPlan(updatedPlan);

      // Recarrega os dados
      loadData();
      setEditingQuiz(false);
      showSuccess('Quiz atualizado com sucesso!');
    } catch (error: any) {
      showError(error.message || 'Erro ao salvar quiz');
    } finally {
      setSavingQuiz(false);
    }
  };

  const handleStartEditObjectives = () => {
    if (lessonPlan?.objectives) {
      setEditedObjectives([...lessonPlan.objectives]);
      setEditingObjectives(true);
    }
  };

  const handleCancelEditObjectives = () => {
    if (lessonPlan?.objectives) {
      setEditedObjectives([...lessonPlan.objectives]);
    }
    setEditingObjectives(false);
  };

  const handleUpdateObjective = (index: number, value: string) => {
    setEditedObjectives(prev => {
      const newObjectives = [...prev];
      newObjectives[index] = value;
      return newObjectives;
    });
  };

  const handleAddObjective = () => {
    setEditedObjectives(prev => [...prev, '']);
  };

  const handleRemoveObjective = (index: number) => {
    setEditedObjectives(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveObjectives = async () => {
    if (!lessonPlan) return;

    setSavingPlan(true);
    try {
      const planEntity = lessonPlanService.getLessonPlanById(lessonPlan.id);
      if (!planEntity) {
        throw new Error('Plano de aula não encontrado');
      }

      const updatedPlan = {
        ...planEntity,
        objectives: editedObjectives.filter(obj => obj.trim().length > 0),
      };

      lessonPlanService.saveLessonPlan(updatedPlan);
      loadData();
      setEditingObjectives(false);
      showSuccess('Objetivos atualizados com sucesso!');
    } catch (error: any) {
      showError(error.message || 'Erro ao salvar objetivos');
    } finally {
      setSavingPlan(false);
    }
  };

  const handleStartEditMethodology = () => {
    if (lessonPlan?.methodology) {
      setEditedMethodology(lessonPlan.methodology);
      setEditingMethodology(true);
    }
  };

  const handleCancelEditMethodology = () => {
    if (lessonPlan?.methodology) {
      setEditedMethodology(lessonPlan.methodology);
    }
    setEditingMethodology(false);
  };

  const handleSaveMethodology = async () => {
    if (!lessonPlan) return;

    setSavingPlan(true);
    try {
      const planEntity = lessonPlanService.getLessonPlanById(lessonPlan.id);
      if (!planEntity) {
        throw new Error('Plano de aula não encontrado');
      }

      const updatedPlan = {
        ...planEntity,
        methodology: editedMethodology,
      };

      lessonPlanService.saveLessonPlan(updatedPlan);
      loadData();
      setEditingMethodology(false);
      showSuccess('Metodologia atualizada com sucesso!');
    } catch (error: any) {
      showError(error.message || 'Erro ao salvar metodologia');
    } finally {
      setSavingPlan(false);
    }
  };

  const handleStartEditContent = () => {
    if (lessonPlan?.content) {
      setEditedContent(lessonPlan.content);
      setEditingContent(true);
    }
  };

  const handleCancelEditContent = () => {
    if (lessonPlan?.content) {
      setEditedContent(lessonPlan.content);
    }
    setEditingContent(false);
  };

  const handleSaveContent = async () => {
    if (!lessonPlan) return;

    setSavingPlan(true);
    try {
      const planEntity = lessonPlanService.getLessonPlanById(lessonPlan.id);
      if (!planEntity) {
        throw new Error('Plano de aula não encontrado');
      }

      const updatedPlan = {
        ...planEntity,
        content: editedContent,
      };

      lessonPlanService.saveLessonPlan(updatedPlan);
      loadData();
      setEditingContent(false);
      showSuccess('Conteúdo atualizado com sucesso!');
    } catch (error: any) {
      showError(error.message || 'Erro ao salvar conteúdo');
    } finally {
      setSavingPlan(false);
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
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🎯</span>
                      <h3 className="text-2xl font-bold text-gray-900">Objetivos de Aprendizagem</h3>
                    </div>
                    {canGenerate && !editingObjectives && (
                      <Button
                        onClick={handleStartEditObjectives}
                        variant="secondary"
                        className="bg-primary-600 hover:bg-primary-700 text-white"
                      >
                        ✏️ Editar
                      </Button>
                    )}
                    {canGenerate && editingObjectives && (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddObjective}
                          variant="secondary"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          ➕ Adicionar
                        </Button>
                        <Button
                          onClick={handleCancelEditObjectives}
                          variant="secondary"
                          className="bg-gray-500 hover:bg-gray-600 text-white"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleSaveObjectives}
                          disabled={savingPlan}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {savingPlan ? 'Salvando...' : '💾 Salvar'}
                        </Button>
                      </div>
                    )}
                  </div>
                  <ul className="space-y-3">
                    {(editingObjectives ? editedObjectives : lessonPlan.objectives).map((objective, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100 relative">
                        {editingObjectives && (
                          <div className="absolute top-2 right-2">
                            <ConfirmDeleteButton
                              onConfirm={() => handleRemoveObjective(index)}
                              itemName="objetivo"
                            />
                          </div>
                        )}
                        <span className="text-primary-600 font-bold text-xl mt-0.5">•</span>
                        {editingObjectives ? (
                          <Input
                            value={objective}
                            onChange={(e) => handleUpdateObjective(index, e.target.value)}
                            placeholder="Digite o objetivo..."
                            className="flex-1"
                          />
                        ) : (
                          <span className="text-gray-700 leading-relaxed">{objective}</span>
                        )}
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
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">📝</span>
                      <h3 className="text-2xl font-bold text-gray-900">Metodologia</h3>
                    </div>
                    {canGenerate && !editingMethodology && (
                      <Button
                        onClick={handleStartEditMethodology}
                        variant="secondary"
                        className="bg-primary-600 hover:bg-primary-700 text-white"
                      >
                        ✏️ Editar
                      </Button>
                    )}
                    {canGenerate && editingMethodology && (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleCancelEditMethodology}
                          variant="secondary"
                          className="bg-gray-500 hover:bg-gray-600 text-white"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleSaveMethodology}
                          disabled={savingPlan}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {savingPlan ? 'Salvando...' : '💾 Salvar'}
                        </Button>
                      </div>
                    )}
                  </div>
                  {editingMethodology ? (
                    <Textarea
                      value={editedMethodology}
                      onChange={(e) => setEditedMethodology(e.target.value)}
                      placeholder="Digite a metodologia..."
                      rows={8}
                      className="w-full"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">{lessonPlan.methodology}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Conteúdo */}
              {lessonPlan.content && (
                <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">📚</span>
                      <h3 className="text-2xl font-bold text-gray-900">Conteúdo</h3>
                    </div>
                    {canGenerate && !editingContent && (
                      <Button
                        onClick={handleStartEditContent}
                        variant="secondary"
                        className="bg-primary-600 hover:bg-primary-700 text-white"
                      >
                        ✏️ Editar
                      </Button>
                    )}
                    {canGenerate && editingContent && (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleCancelEditContent}
                          variant="secondary"
                          className="bg-gray-500 hover:bg-gray-600 text-white"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleSaveContent}
                          disabled={savingPlan}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {savingPlan ? 'Salvando...' : '💾 Salvar'}
                        </Button>
                      </div>
                    )}
                  </div>
                  {editingContent ? (
                    <Textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      placeholder="Digite o conteúdo..."
                      rows={12}
                      className="w-full"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">{lessonPlan.content}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Atividade Avaliativa */}
              {lessonPlan.quiz && lessonPlan.quiz.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">✏️</span>
                      <h3 className="text-2xl font-bold text-gray-900">Atividade Avaliativa</h3>
                    </div>
                    {canGenerate && !editingQuiz && (
                      <Button
                        onClick={handleStartEditQuiz}
                        variant="secondary"
                        className="bg-primary-600 hover:bg-primary-700 text-white"
                      >
                        ✏️ Editar Quiz
                      </Button>
                    )}
                    {canGenerate && editingQuiz && (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddQuizQuestion}
                          variant="secondary"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          ➕ Adicionar Questão
                        </Button>
                        <Button
                          onClick={handleCancelEditQuiz}
                          variant="secondary"
                          className="bg-gray-500 hover:bg-gray-600 text-white"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleSaveQuiz}
                          disabled={savingQuiz}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {savingQuiz ? 'Salvando...' : '💾 Salvar'}
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-6">
                    {(editingQuiz ? editedQuiz : lessonPlan.quiz).map((question, index) => (
                      <div key={question.id} className="border-l-4 border-primary-500 pl-6 py-4 bg-gradient-to-r from-primary-50/50 to-transparent rounded-r-xl relative">
                        {editingQuiz && (
                          <div className="absolute top-2 right-2">
                            <ConfirmDeleteButton
                              onConfirm={() => handleRemoveQuizQuestion(question.id)}
                              itemName="questão"
                            />
                          </div>
                        )}
                        <div className="flex items-start gap-3 mb-4">
                          <span className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                            {index + 1}
                          </span>
                          {editingQuiz ? (
                            <div className="flex-1">
                              <Textarea
                                value={question.question}
                                onChange={(e) => handleUpdateQuizQuestion(question.id, 'question', e.target.value)}
                                placeholder="Digite a pergunta..."
                                rows={3}
                                className="w-full"
                              />
                            </div>
                          ) : (
                            <p className="font-semibold text-gray-900 text-lg leading-relaxed">{question.question}</p>
                          )}
                        </div>
                        <ul className="space-y-2 mb-4 ml-11">
                          {question.options.map((option, optIndex) => (
                            <li
                              key={optIndex}
                              className={`p-3 rounded-xl transition-all ${
                                !editingQuiz && optIndex === question.correctAnswer
                                  ? 'bg-green-50 border-2 border-green-300 text-green-800 shadow-md'
                                  : 'bg-gray-50 border border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-700">{String.fromCharCode(65 + optIndex)}.</span>
                                {editingQuiz ? (
                                  <Input
                                    value={option}
                                    onChange={(e) => handleUpdateQuizOption(question.id, optIndex, e.target.value)}
                                    placeholder={`Alternativa ${String.fromCharCode(65 + optIndex)}...`}
                                    className="flex-1"
                                  />
                                ) : (
                                  <span className="text-gray-700 flex-1">{option}</span>
                                )}
                                {editingQuiz && (
                                  <input
                                    type="radio"
                                    name={`correct-${question.id}`}
                                    checked={optIndex === question.correctAnswer}
                                    onChange={() => handleUpdateQuizQuestion(question.id, 'correctAnswer', optIndex)}
                                    className="w-5 h-5 text-primary-600"
                                  />
                                )}
                                {!editingQuiz && optIndex === question.correctAnswer && (
                                  <span className="text-green-700 font-bold text-lg">✓</span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div className="ml-11">
                          {editingQuiz ? (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">💡 Justificativa:</label>
                              <Textarea
                                value={question.justification}
                                onChange={(e) => handleUpdateQuizQuestion(question.id, 'justification', e.target.value)}
                                placeholder="Digite a justificativa..."
                                rows={3}
                                className="w-full"
                              />
                            </div>
                          ) : (
                            <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 border border-blue-200">
                              <strong className="text-blue-900">💡 Justificativa:</strong>
                              <p className="mt-1 text-blue-700 leading-relaxed">{question.justification}</p>
                            </div>
                          )}
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
