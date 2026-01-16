'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useToast } from '@/app/hooks';
import { LoadingSpinner, EmptyState, ToastContainer, ActionButton } from '@/app/components';
import type { Unit, LessonPlan, Activity } from '@/application/viewmodels';

/**
 * Página de Conteúdos Arquivados
 * 
 * Exibe todos os materiais arquivados organizados por tipo:
 * - Unidades arquivadas
 * - Planos de aula arquivados
 * - Atividades arquivadas
 * 
 * Permite restaurar (desarquivar) materiais
 */
export default function ArquivadosPage() {
  const [archivedUnits, setArchivedUnits] = useState<Unit[]>([]);
  const [archivedPlans, setArchivedPlans] = useState<LessonPlan[]>([]);
  const [archivedActivities, setArchivedActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'unidades' | 'planos' | 'atividades'>('unidades');
  const { toasts, showToast, removeToast } = useToast();

  const loadArchivedContent = useCallback(async () => {
    try {
      setLoading(true);

      const { LocalStorageUnitRepository } = await import('@/repository/implementations/LocalStorageUnitRepository');
      const { LocalStorageLessonPlanRepository } = await import('@/repository/implementations/LocalStorageLessonPlanRepository');
      const { LocalStorageActivityRepository } = await import('@/repository/implementations/LocalStorageActivityRepository');

      const unitRepository = new LocalStorageUnitRepository();
      const planRepository = new LocalStorageLessonPlanRepository();
      const activityRepository = new LocalStorageActivityRepository();

      const [allUnits, allPlans, allActivities] = await Promise.all([
        unitRepository.findAll(),
        planRepository.findAll(),
        activityRepository.findAll(),
      ]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Carregando conteúdos arquivados..." size="lg" />
      </div>
    );
  }

  const totalArchived = archivedUnits.length + archivedPlans.length + archivedActivities.length;

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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <span className="text-4xl">📦</span>
              Conteúdos Arquivados
            </h1>
            <p className="text-gray-600">
              Gerencie e restaure materiais arquivados. Total: {totalArchived} item(s)
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-4 border-b border-gray-300">
            <button
              onClick={() => setActiveTab('unidades')}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'unidades'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Unidades ({archivedUnits.length})
            </button>
            <button
              onClick={() => setActiveTab('planos')}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'planos'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Planos ({archivedPlans.length})
            </button>
            <button
              onClick={() => setActiveTab('atividades')}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'atividades'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Atividades ({archivedActivities.length})
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
                        className="bg-white rounded-xl shadow-lg p-6 border border-gray-300 opacity-75 hover:opacity-100 transition-opacity"
                      >
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{unit.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{unit.theme}</p>
                          {unit.archivedAt && (
                            <p className="text-xs text-gray-500">
                              Arquivado em {new Date(unit.archivedAt).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleUnarchiveUnit(unit.id)}
                          className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
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
                        className="bg-white rounded-xl shadow-lg p-6 border border-gray-300 opacity-75 hover:opacity-100 transition-opacity"
                      >
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{plan.objective}</p>
                          {plan.archivedAt && (
                            <p className="text-xs text-gray-500">
                              Arquivado em {new Date(plan.archivedAt).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleUnarchivePlan(plan.id)}
                          className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
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
                        className="bg-white rounded-xl shadow-lg p-6 border border-gray-300 opacity-75 hover:opacity-100 transition-opacity"
                      >
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.title}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{activity.description}</p>
                          {activity.archivedAt && (
                            <p className="text-xs text-gray-500">
                              Arquivado em {new Date(activity.archivedAt).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleUnarchiveActivity(activity.id)}
                          className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
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
