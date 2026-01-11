// src/app/page.tsx
// Dashboard Principal - Wireframe 1
'use client';

import { useSubjects } from '@/hooks/useSubjects';
import { useUnits } from '@/hooks/useUnits';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { StatCard } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function DashboardPage() {
  const { subjects, loading: subjectsLoading } = useSubjects();
  const { units: allUnits, loading: unitsLoading } = useUnits();
  
  const loading = subjectsLoading || unitsLoading;
  const recentUnits = allUnits.slice(0, 5);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="🎓 Hacka Cultura Digital"
        subtitle="Sistema Inteligente de Materiais Didáticos"
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
                title="Nenhuma disciplina cadastrada. Crie sua primeira disciplina!"
                action={
                  <Link href="/subjects/new">
                    <Button>Criar Disciplina</Button>
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
                    <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                    {subject.description && (
                      <p className="text-sm text-gray-600 mt-1">{subject.description}</p>
                    )}
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
                  <div key={unit.id} className="p-4 border rounded-lg">
                    <h3 className="font-medium text-gray-900">{unit.topic}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {unit.gradeYear} • {unit.isSuggestedByAI ? 'Sugerida por IA' : 'Criada manualmente'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
