// src/app/page.tsx
// Dashboard Principal - Wireframe 1
'use client';

import { useEffect, useState } from 'react';
import { getLessonPlanService } from '@/lib/service';
import { Subject } from '@/core/entities/Subject';
import { Unit } from '@/core/entities/Unit';
import Link from 'next/link';

export default function DashboardPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [recentUnits, setRecentUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const service = getLessonPlanService();
    
    try {
      const allSubjects = service.getSubjects();
      const allUnits = service.getUnits();
      
      setSubjects(allSubjects);
      setRecentUnits(allUnits.slice(0, 5)); // Últimas 5 unidades
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            🎓 Hacka Cultura Digital
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Sistema Inteligente de Materiais Didáticos
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Disciplinas</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{subjects.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Unidades</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{recentUnits.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Planos de Aula</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {recentUnits.filter(u => u.lessonPlanId).length}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-8">
          <Link
            href="/subjects/new"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            ➕ Nova Disciplina
          </Link>
        </div>

        {/* Disciplinas */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Disciplinas</h2>
          </div>
          <div className="p-6">
            {subjects.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nenhuma disciplina cadastrada. Crie sua primeira disciplina!
              </p>
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
      </main>
    </div>
  );
}
