'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useToast } from '@/app/hooks';
import { LoadingSpinner, EmptyState, ToastContainer, ActionButton } from '@/app/components';
import type { Unit, LessonPlan, Activity, Subject } from '@/application/viewmodels';

/**
 * Página de Conteúdos Arquivados
 * 
 * Exibe todos os materiais arquivados organizados por tipo:
 * - Disciplinas arquivadas
 * - Unidades arquivadas
 * - Planos de aula arquivados
 * - Atividades arquivadas
 * 
 * Permite restaurar (desarquivar) materiais
 */
export default function ArquivadosPage() {
  const [archivedSubjects, setArchivedSubjects] = useState<Subject[]>([]);
  const [archivedUnits, setArchivedUnits] = useState<Unit[]>([]);
  const [archivedPlans, setArchivedPlans] = useState<LessonPlan[]>([]);
  const [archivedActivities, setArchivedActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'disciplinas' | 'unidades' | 'planos' | 'atividades'>('disciplinas');
  const { toasts, showToast, removeToast } = useToast();

  const loadArchivedContent = useCallback(async () => {
    try {
      setLoading(true);

      const { LocalStorageSubjectRepository } = await import('@/repository/implementations/LocalStorageSubjectRepository');
      const { LocalStorageUnitRepository } = await import('@/repository/implementations/LocalStorageUnitRepository');
      const { LocalStorageLessonPlanRepository } = await import('@/repository/implementations/LocalStorageLessonPlanRepository');
      const { LocalStorageActivityRepository } = await import('@/repository/implementations/LocalStorageActivityRepository');

      const subjectRepository = new LocalStorageSubjectRepository();
      const unitRepository = new LocalStorageUnitRepository();
      const planRepository = new LocalStorageLessonPlanRepository();
      const activityRepository = new LocalStorageActivityRepository();

      // Para buscar todas as disciplinas (incluindo arquivadas), precisamos acessar o storage diretamente
      // Como findAll() filtra arquivadas, vamos usar uma abordagem alternativa
      const storageKey = 'subjects';
      let allSubjects: Subject[] = [];
      if (typeof window !== 'undefined' && localStorage.getItem(storageKey)) {
        const data = localStorage.getItem(storageKey);
        if (data) {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            allSubjects = parsed;
          }
        }
      }

      const [allUnits, allPlans, allActivities] = await Promise.all([
        unitRepository.findAll(),
        planRepository.findAll(),
        activityRepository.findAll(),
      ]);

      setArchivedSubjects(allSubjects.filter((s) => s.archived === true));
      setArchivedUnits(allUnits.filter((u) => u.archived === true));
      setArchivedPlans(allPlans.filter((p) => p.archived === true));
      setArchivedActivities(allActivities.filter((a) => a.archived === true));
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar conteúdos arquivados', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadArchivedContent();
  }, [loadArchivedContent]);

  const handleUnarchiveUnit = async (unitId: string) => {
    try {
      const { LocalStorageUnitRepository } = await import('@/repository/implementations/LocalStorageUnitRepository');
      const unitRepository = new LocalStorageUnitRepository();

      await unitRepository.update(unitId, {
        archived: false,
        archivedAt: undefined,
      });

      showToast('Unidade restaurada com sucesso!', 'success');
      await loadArchivedContent();
    } catch (err: any) {
      showToast(err.message || 'Erro ao restaurar unidade', 'error');
    }
  };

  const handleUnarchivePlan = async (planId: string) => {
    try {
      const { LocalStorageLessonPlanRepository } = await import('@/repository/implementations/LocalStorageLessonPlanRepository');
      const planRepository = new LocalStorageLessonPlanRepository();

      await planRepository.update(planId, {
        archived: false,
        archivedAt: undefined,
      });

      showToast('Plano de aula restaurado com sucesso!', 'success');
      await loadArchivedContent();
    } catch (err: any) {
      showToast(err.message || 'Erro ao restaurar plano', 'error');
    }
  };

  const handleUnarchiveActivity = async (activityId: string) => {
    try {
      const { LocalStorageActivityRepository } = await import('@/repository/implementations/LocalStorageActivityRepository');
      const activityRepository = new LocalStorageActivityRepository();

      await activityRepository.update(activityId, {
        archived: false,
        archivedAt: undefined,
      });

      showToast('Atividade restaurada com sucesso!', 'success');
      await loadArchivedContent();
    } catch (err: any) {
      showToast(err.message || 'Erro ao restaurar atividade', 'error');
    }
  };

  const handleUnarchiveSubject = async (subjectId: string) => {
    try {
      const { LocalStorageSubjectRepository } = await import('@/repository/implementations/LocalStorageSubjectRepository');
      const subjectRepository = new LocalStorageSubjectRepository();

      await subjectRepository.update(subjectId, {
        archived: false,
        archivedAt: undefined,
      });

      showToast('Disciplina restaurada com sucesso!', 'success');
      await loadArchivedContent();
    } catch (err: any) {
      showToast(err.message || 'Erro ao restaurar disciplina', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Carregando conteúdos arquivados..." size="lg" />
      </div>
    );
  }

  const totalArchived = archivedSubjects.length + archivedUnits.length + archivedPlans.length + archivedActivities.length;

  if (totalArchived === 0) {
    return (
      <>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <div className="min-h-screen bg-gray-50">
          <div className="px-8 py-8">
            <Link
              href="/professor"
              className="text-gray-600 hover:text-gray-900 mb-6 inline-flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <span>←</span>
              <span>Voltar para Dashboard</span>
            </Link>

            <EmptyState
              icon="📦"
              title="Nenhum conteúdo arquivado"
              description="Não há materiais arquivados no momento. Os materiais arquivados aparecerão aqui."
              actionLabel="Voltar para Dashboard"
              actionHref="/professor"
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="min-h-screen bg-gray-50">
        <div className="px-8 py-8">
          <Link
            href="/professor"
            className="text-gray-600 hover:text-gray-900 mb-6 inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <span>←</span>
            <span>Voltar para Dashboard</span>
          </Link>

          {/* Header */}
          <div className="mb-8 bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <span className="text-4xl">📦</span>
                  Conteúdos Arquivados
                </h1>
                <p className="text-gray-600">
                  Gerencie e restaure materiais arquivados. Total: <span className="font-semibold text-gray-900">{totalArchived}</span> item(s)
                </p>
              </div>
              <div className="flex gap-2">
                <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-200">
                  <span className="text-sm text-indigo-700 font-semibold">
                    {archivedUnits.length} Unidades
                  </span>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                  <span className="text-sm text-blue-700 font-semibold">
                    {archivedPlans.length} Planos
                  </span>
                </div>
                <div className="bg-purple-50 px-4 py-2 rounded-lg border border-purple-200">
                  <span className="text-sm text-purple-700 font-semibold">
                    {archivedActivities.length} Atividades
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-4 border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab('disciplinas')}
              className={`px-6 py-3 font-semibold transition-all border-b-2 relative ${
                activeTab === 'disciplinas'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>📚</span>
                <span>Disciplinas</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === 'disciplinas' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {archivedSubjects.length}
                </span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('unidades')}
              className={`px-6 py-3 font-semibold transition-all border-b-2 relative ${
                activeTab === 'unidades'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>📖</span>
                <span>Unidades</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === 'unidades' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {archivedUnits.length}
                </span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('planos')}
              className={`px-6 py-3 font-semibold transition-all border-b-2 relative ${
                activeTab === 'planos'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>📋</span>
                <span>Planos</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === 'planos' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {archivedPlans.length}
                </span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('atividades')}
              className={`px-6 py-3 font-semibold transition-all border-b-2 relative ${
                activeTab === 'atividades'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>📝</span>
                <span>Atividades</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === 'atividades' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {archivedActivities.length}
                </span>
              </span>
            </button>
          </div>

          {/* Conteúdo das Tabs */}
          <div className="mt-6">
            {activeTab === 'unidades' && (
              <div>
                {archivedUnits.length === 0 ? (
                  <EmptyState
                    icon="📖"
                    title="Nenhuma unidade arquivada"
                    description="As unidades arquivadas aparecerão aqui."
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {archivedUnits.map((unit) => (
                      <div
                        key={unit.id}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border-2 border-gray-200 hover:border-indigo-300 transition-all hover:shadow-xl group"
                      >
                        <div className="mb-4">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                              {unit.title}
                            </h3>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg border border-gray-200">
                              📖
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{unit.theme}</p>
                          {unit.archivedAt && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                              <span>📅</span>
                              <span>Arquivado em {new Date(unit.archivedAt).toLocaleDateString('pt-BR')}</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleUnarchiveUnit(unit.id)}
                          className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                        >
                          <span className="mr-2">📦</span>
                          Restaurar Unidade
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'planos' && (
              <div>
                {archivedPlans.length === 0 ? (
                  <EmptyState
                    icon="📋"
                    title="Nenhum plano arquivado"
                    description="Os planos de aula arquivados aparecerão aqui."
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {archivedPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-6 border-2 border-gray-200 hover:border-blue-300 transition-all hover:shadow-xl group"
                      >
                        <div className="mb-4">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                              {plan.title}
                            </h3>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg border border-blue-200">
                              📋
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{plan.objective}</p>
                          {plan.archivedAt && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                              <span>📅</span>
                              <span>Arquivado em {new Date(plan.archivedAt).toLocaleDateString('pt-BR')}</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleUnarchivePlan(plan.id)}
                          className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                        >
                          <span className="mr-2">📦</span>
                          Restaurar Plano
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'atividades' && (
              <div>
                {archivedActivities.length === 0 ? (
                  <EmptyState
                    icon="📝"
                    title="Nenhuma atividade arquivada"
                    description="As atividades arquivadas aparecerão aqui."
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {archivedActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg p-6 border-2 border-gray-200 hover:border-purple-300 transition-all hover:shadow-xl group"
                      >
                        <div className="mb-4">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                              {activity.title}
                            </h3>
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg border border-purple-200">
                              📝
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{activity.description}</p>
                          {activity.archivedAt && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                              <span>📅</span>
                              <span>Arquivado em {new Date(activity.archivedAt).toLocaleDateString('pt-BR')}</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleUnarchiveActivity(activity.id)}
                          className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                        >
                          <span className="mr-2">📦</span>
                          Restaurar Atividade
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
