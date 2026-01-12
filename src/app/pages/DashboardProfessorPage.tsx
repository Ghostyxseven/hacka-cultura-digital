// src/app/pages/DashboardProfessorPage.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useSubjects } from '@/hooks/useSubjects';
import { useUnits } from '@/hooks/useUnits';
import { HeaderWithAuth } from '@/components/layout/HeaderWithAuth';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import Link from 'next/link';

export function DashboardProfessorPage() {
  const { user, isProfessor } = useAuth();
  const { subjects, loading: subjectsLoading } = useSubjects();
  const { units: allUnits, loading: unitsLoading } = useUnits();

  const loading = subjectsLoading || unitsLoading;
  const recentUnits = allUnits.slice(0, 5);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderWithAuth
        title={`👨‍🏫 Bem-vindo, ${user?.name}`}
        subtitle="Gerencie suas disciplinas e materiais didáticos"
      />

      <PageContainer>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Disciplinas" value={subjects.length} />
          <StatCard title="Unidades" value={allUnits.length} />
          <StatCard
            title="Planos de Aula"
            value={allUnits.filter(u => u.lessonPlanId).length}
          />
        </div>

        {/* Actions */}
        <div className="mb-8">
          <Link href="/subjects/new">
            <Button>➕ Nova Disciplina</Button>
          </Link>
        </div>

        {/* Disciplinas */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Disciplinas</h2>
          </div>
          <div className="p-6">
            {subjects.length === 0 ? (
              <EmptyState
                title="Nenhuma disciplina cadastrada"
                description="Comece criando uma nova disciplina"
                action={
                  <Link href="/subjects/new">
                    <Button>➕ Nova Disciplina</Button>
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <Link
                    key={subject.id}
                    href={`/subjects/${subject.id}`}
                    className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{subject.name}</h3>
                    {subject.description && (
                      <p className="text-sm text-gray-600 mb-2">{subject.description}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {allUnits.filter(u => u.subjectId === subject.id).length} unidades
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Unidades Recentes */}
        {recentUnits.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Unidades Recentes</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {recentUnits.map((unit) => (
                  <Link
                    key={unit.id}
                    href={`/units/${unit.id}/lesson-plan`}
                    className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{unit.topic}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {subjects.find(s => s.id === unit.subjectId)?.name || 'Disciplina'}
                        </p>
                      </div>
                      {unit.lessonPlanId && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Plano Gerado
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
