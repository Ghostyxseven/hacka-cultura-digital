// src/app/(dashboards)/aluno/quiz/[lessonPlanId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getLessonPlanService } from '@/lib/service';
import { getTakeQuizUseCase, getGetQuizResultsUseCase } from '@/lib/quizService';
import { PresentationMapper } from '@/application';
import type { LessonPlanViewModel, QuizQuestionViewModel } from '@/application/viewmodels';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { Button, BackButton } from '@/components';
import { EmptyState } from '@/components/ui/EmptyState';
import { showError, showSuccess } from '@/utils/notifications';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const lessonPlanId = params.lessonPlanId as string;
  const { user, isAluno } = useAuth();

  const [lessonPlan, setLessonPlan] = useState<LessonPlanViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!isAluno) {
      router.push('/aluno');
      return;
    }
    loadData();
  }, [lessonPlanId, isAluno, router]);

  const loadData = () => {
    try {
      const service = getLessonPlanService();
      const planEntity = service.getLessonPlanById(lessonPlanId);
      const plan = planEntity ? PresentationMapper.toLessonPlanViewModel(planEntity) : undefined;

      if (!plan) {
        showError('Plano de aula não encontrado');
        router.push('/aluno');
        return;
      }

      if (!plan.quiz || plan.quiz.length === 0) {
        showError('Este plano de aula não possui quiz');
        router.push('/aluno');
        return;
      }

      setLessonPlan(plan);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      showError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleSubmit = async () => {
    if (!lessonPlan || !user) return;

    // Verifica se todas as questões foram respondidas
    if (lessonPlan.quiz.length !== Object.keys(answers).length) {
      showError('Por favor, responda todas as questões antes de enviar');
      return;
    }

    setSubmitting(true);
    try {
      const takeQuizUseCase = getTakeQuizUseCase();
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      const quizResult = takeQuizUseCase.execute({
        lessonPlanId: lessonPlan.id,
        userId: user.id,
        answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer,
        })),
        timeSpent,
      });

      setResult(quizResult);
      showSuccess('Quiz enviado com sucesso!');
    } catch (error: any) {
      showError(error.message || 'Erro ao enviar quiz');
    } finally {
      setSubmitting(false);
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

  if (!lessonPlan) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        {/* Header Moderno */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-xl border-b border-blue-700/20">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <BackButton href="/aluno" className="bg-white/20 hover:bg-white/30 text-white border-white/30" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <span className="text-5xl">✏️</span>
                  <span>Quiz: {lessonPlan.title}</span>
                </h1>
                <p className="text-blue-100 text-lg">Responda as questões abaixo</p>
              </div>
            </div>
          </div>
        </div>

        <PageContainer maxWidth="md">
          {result ? (
            // Tela de Resultado
            <div className="space-y-6">
              <div className={`bg-white rounded-2xl shadow-xl p-8 text-center border-2 ${
                result.score >= 70 ? 'border-green-500' : result.score >= 50 ? 'border-yellow-500' : 'border-red-500'
              }`}>
                <div className="text-6xl mb-4">
                  {result.score >= 70 ? '🎉' : result.score >= 50 ? '👍' : '📚'}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {result.score >= 70 ? 'Parabéns!' : result.score >= 50 ? 'Bom trabalho!' : 'Continue estudando!'}
                </h2>
                <div className="text-5xl font-bold mb-4" style={{
                  color: result.score >= 70 ? '#10b981' : result.score >= 50 ? '#f59e0b' : '#ef4444'
                }}>
                  {result.score}%
                </div>
                <p className="text-gray-600 mb-4">
                  Você acertou {result.correctAnswers} de {result.totalQuestions} questões
                </p>
                <div className="flex gap-4 justify-center mt-6">
                  <Button
                    onClick={() => router.push('/aluno')}
                    className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  >
                    <span className="mr-2">🏠</span>
                    Voltar ao Dashboard
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setResult(null);
                      setAnswers({});
                    }}
                    className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  >
                    <span className="mr-2">🔄</span>
                    Refazer Quiz
                  </Button>
                </div>
              </div>

              {/* Detalhes das Respostas */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalhes das Respostas</h3>
                {lessonPlan.quiz.map((question, index) => {
                  const answer = result.answers.find((a: any) => a.questionId === question.id);
                  const isCorrect = answer?.isCorrect;
                  
                  return (
                    <div
                      key={question.id}
                      className={`p-4 rounded-xl mb-4 border-2 ${
                        isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span className={`text-2xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {isCorrect ? '✓' : '✗'}
                        </span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-2">
                            Questão {index + 1}: {question.question}
                          </p>
                          <div className="space-y-2">
                            {question.options.map((option, optIndex) => {
                              const isSelected = answer?.selectedAnswer === optIndex;
                              const isCorrectAnswer = optIndex === question.correctAnswer;
                              
                              return (
                                <div
                                  key={optIndex}
                                  className={`p-2 rounded-lg ${
                                    isCorrectAnswer
                                      ? 'bg-green-100 border-2 border-green-400'
                                      : isSelected
                                      ? 'bg-red-100 border-2 border-red-400'
                                      : 'bg-gray-50 border border-gray-200'
                                  }`}
                                >
                                  <span className="font-bold mr-2">
                                    {String.fromCharCode(65 + optIndex)})
                                  </span>
                                  {option}
                                  {isCorrectAnswer && <span className="ml-2 text-green-700 font-bold">✓ Correta</span>}
                                  {isSelected && !isCorrectAnswer && <span className="ml-2 text-red-700 font-bold">Sua resposta</span>}
                                </div>
                              );
                            })}
                          </div>
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800">
                              <strong>Justificativa:</strong> {question.justification}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Tela do Quiz
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Questões</h2>
                  <span className="text-sm text-gray-600">
                    {Object.keys(answers).length} / {lessonPlan.quiz.length} respondidas
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(Object.keys(answers).length / lessonPlan.quiz.length) * 100}%` }}
                  />
                </div>
              </div>

              {lessonPlan.quiz.map((question, index) => (
                <div
                  key={question.id}
                  className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-lg mb-4">
                        {question.question}
                      </p>
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => {
                          const isSelected = answers[question.id] === optIndex;
                          
                          return (
                            <label
                              key={optIndex}
                              className={`flex items-center p-4 rounded-xl cursor-pointer transition-all border-2 ${
                                isSelected
                                  ? 'bg-blue-50 border-blue-500 shadow-md'
                                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={optIndex}
                                checked={isSelected}
                                onChange={() => handleAnswerChange(question.id, optIndex)}
                                className="w-5 h-5 text-blue-600 mr-3"
                              />
                              <span className="font-bold mr-2 text-gray-700">
                                {String.fromCharCode(65 + optIndex)})
                              </span>
                              <span className="text-gray-700">{option}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || Object.keys(answers).length !== lessonPlan.quiz.length}
                  className="w-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  {submitting ? (
                    <>
                      <span className="mr-2">⏳</span>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✅</span>
                      Enviar Respostas
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </PageContainer>
      </div>
    </ProtectedRoute>
  );
}
