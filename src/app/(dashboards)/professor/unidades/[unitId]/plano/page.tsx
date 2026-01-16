'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ApplicationServiceFactory } from '@/application';
import type { Unit, LessonPlan, Activity, Subject } from '@/application/viewmodels';

export default function GenerateLessonPlanPage() {
  const params = useParams();
  const router = useRouter();
  const unitId = params.unitId as string;

  const [unit, setUnit] = useState<Unit | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    year: '',
    additionalContext: '',
  });

  useEffect(() => {
    loadData();
  }, [unitId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const subjectService = ApplicationServiceFactory.createSubjectService();
      const materialService = ApplicationServiceFactory.createMaterialGenerationService();

      // Busca unidade e disciplina
      const unitRepo = ApplicationServiceFactory.createUnitService();
      // Para buscar unidade, precisamos do repositório diretamente por enquanto
      // Isso será melhorado quando refatorarmos os hooks

      // Tenta buscar plano e atividade existentes
      try {
        const [plan, act] = await Promise.all([
          materialService.getLessonPlanByUnit(unitId),
          materialService.getActivityByUnit(unitId),
        ]);
        setLessonPlan(plan);
        setActivity(act);
      } catch {
        // Plano/atividade não existem ainda
        setShowForm(true);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');

    try {
      const materialService = ApplicationServiceFactory.createMaterialGenerationService();

      // Gera plano de aula e atividade
      const result = await materialService.generateAllMaterials({
        unitId,
        year: formData.year || undefined,
        additionalContext: formData.additionalContext || undefined,
      });

      setLessonPlan(result.lessonPlan);
      setActivity(result.activity);
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar materiais');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-indigo-600 hover:text-indigo-700 mb-4 inline-block">
          ← Voltar para Dashboard
        </Link>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {showForm && !lessonPlan && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gerar Materiais Didáticos</h1>
            <p className="text-gray-600 mb-6">
              Gere automaticamente um plano de aula e uma atividade avaliativa alinhados à BNCC
              usando Inteligência Artificial.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                  Ano/Série (opcional)
                </label>
                <input
                  type="text"
                  id="year"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: 7º ano, 1º ano EM"
                />
              </div>

              <div>
                <label
                  htmlFor="additionalContext"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contexto Adicional (opcional)
                </label>
                <textarea
                  id="additionalContext"
                  value={formData.additionalContext}
                  onChange={(e) =>
                    setFormData({ ...formData, additionalContext: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Informações adicionais sobre a aula, alunos, recursos disponíveis..."
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? 'Gerando Materiais...' : 'Gerar Plano de Aula e Atividade'}
            </button>
          </div>
        )}

        {generating && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              Gerando materiais didáticos com IA... Isso pode levar alguns segundos.
            </p>
          </div>
        )}

        {lessonPlan && activity && (
          <div className="space-y-6">
            {/* Plano de Aula */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{lessonPlan.title}</h1>
                  <p className="text-sm text-gray-500">Duração: {lessonPlan.duration} minutos</p>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Regenerar
                </button>
              </div>

              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Objetivo de Aprendizagem</h2>
                  <p className="text-gray-700 whitespace-pre-line">{lessonPlan.objective}</p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Conteúdo</h2>
                  <p className="text-gray-700 whitespace-pre-line">{lessonPlan.content}</p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Metodologia</h2>
                  <p className="text-gray-700 whitespace-pre-line">{lessonPlan.methodology}</p>
                </section>

                {lessonPlan.resources && lessonPlan.resources.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Recursos Necessários</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {lessonPlan.resources.map((resource, index) => (
                        <li key={index}>{resource}</li>
                      ))}
                    </ul>
                  </section>
                )}

                <section>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Avaliação</h2>
                  <p className="text-gray-700 whitespace-pre-line">{lessonPlan.evaluation}</p>
                </section>

                {lessonPlan.bnccAlignment && (
                  <section className="bg-indigo-50 rounded-lg p-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      Alinhamento com BNCC
                    </h2>
                    <p className="text-gray-700 whitespace-pre-line text-sm">
                      {lessonPlan.bnccAlignment}
                    </p>
                  </section>
                )}
              </div>
            </div>

            {/* Atividade Avaliativa */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">{activity.title}</h2>

              <div className="space-y-6">
                <section>
                  <p className="text-gray-700 whitespace-pre-line">{activity.description}</p>
                </section>

                {activity.instructions && (
                  <section className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-800 mb-2">Instruções:</h3>
                    <p className="text-gray-700 whitespace-pre-line">{activity.instructions}</p>
                  </section>
                )}

                {activity.questions && activity.questions.length > 0 && (
                  <section>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Questões</h3>
                    <div className="space-y-6">
                      {activity.questions.map((question, index) => (
                        <div key={question.id || index} className="border-l-4 border-indigo-500 pl-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-800">
                              Questão {index + 1} ({question.points} pontos)
                            </h4>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              {question.type}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{question.question}</p>
                          {question.options && question.options.length > 0 && (
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                              {question.options.map((option, optIndex) => (
                                <li key={optIndex}>{option}</li>
                              ))}
                            </ul>
                          )}
                          {question.correctAnswer && (
                            <p className="text-sm text-green-600 mt-2">
                              Resposta correta: {question.correctAnswer}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {activity.evaluationCriteria && (
                  <section className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-800 mb-2">Critérios de Avaliação:</h3>
                    <p className="text-gray-700 whitespace-pre-line">{activity.evaluationCriteria}</p>
                  </section>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
