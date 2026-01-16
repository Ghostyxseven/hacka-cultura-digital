// src/app/(dashboards)/professor/planos/page.tsx
// Página para listar todos os planos de aula do professor
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubjects, useUnits } from '@/hooks';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { Button, BackButton } from '@/components';
import { EmptyState } from '@/components/ui/EmptyState';
import { UnitsList } from '@/app/components';
import Link from 'next/link';

export default function MeusPlanosPage() {
  const { user, isProfessor } = useAuth();
  const { subjects, loading: subjectsLoading, refresh: refreshSubjects } = useSubjects();
  const { units: allUnits, loading: unitsLoading, refresh: refreshUnits } = useUnits();

  const loading = subjectsLoading || unitsLoading;
  
  // Recarrega os dados quando a página é montada
  useEffect(() => {
    refreshUnits();
    refreshSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isProfessor) {
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

  // Filtra apenas unidades que têm plano de aula
  // Ordena por data de criação (mais recente primeiro)
  const unitsWithPlans = allUnits
    .filter(u => u.lessonPlanId)
    .sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
      const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-50">
      {/* Header Moderno */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 shadow-xl border-b border-purple-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <BackButton href="/professor" className="bg-white/20 hover:bg-white/30 text-white border-white/30" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="text-5xl">📚</span>
                <span>Meus Planos de Aula</span>
              </h1>
              <p className="text-purple-100 text-lg">Visualize e gerencie todos os seus planos de aula</p>
            </div>
          </div>
        </div>
      </div>

      <PageContainer>
        {unitsWithPlans.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <span className="text-5xl">📖</span>
              </div>
              <EmptyState
                title="Nenhum plano de aula gerado ainda"
                description="Comece criando disciplinas e unidades, depois gere planos de aula usando a IA"
                action={
                  <div className="flex gap-4 justify-center mt-6">
                    <Link href="/professor/disciplinas/new">
                      <Button className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                        <span className="mr-2">➕</span>
                        Nova Disciplina
                      </Button>
                    </Link>
                    <Link href="/professor">
                      <Button variant="secondary" className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                        <span className="mr-2">📊</span>
                        Voltar ao Dashboard
                      </Button>
                    </Link>
                  </div>
                }
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200 transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 px-6 py-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📚</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Planos de Aula
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {unitsWithPlans.length === 1 
                      ? '1 plano de aula gerado' 
                      : `${unitsWithPlans.length} planos de aula gerados`}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <UnitsList
                units={unitsWithPlans}
                subjects={subjects}
                showSubject
                emptyStateTitle="Nenhum plano de aula encontrado"
                emptyStateDescription="Comece gerando planos de aula para suas unidades"
              />
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
