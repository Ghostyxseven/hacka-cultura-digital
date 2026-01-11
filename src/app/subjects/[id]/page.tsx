// src/app/subjects/[id]/page.tsx
// Wireframe 2: Tela de Disciplina
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getLessonPlanService } from '@/lib/service';
import { Subject } from '@/core/entities/Subject';
import { Unit } from '@/core/entities/Unit';
import Link from 'next/link';

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.id as string;
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggesting, setSuggesting] = useState(false);

  useEffect(() => {
    const service = getLessonPlanService();
    
    try {
      const allSubjects = service.getSubjects();
      const foundSubject = allSubjects.find(s => s.id === subjectId);
      
      if (!foundSubject) {
        router.push('/');
        return;
      }
      
      setSubject(foundSubject);
      setUnits(service.getUnits(subjectId));
    } catch (error) {
      console.error('Erro ao carregar disciplina:', error);
    } finally {
      setLoading(false);
    }
  }, [subjectId, router]);

  const handleSuggestUnits = async () => {
    if (!subject) return;
    
    setSuggesting(true);
    try {
      const service = getLessonPlanService();
      // Pega o primeiro gradeYear da disciplina ou usa um padrão
      const gradeYear = subject.gradeYears?.[0] || '8º Ano';
      const suggested = await service.suggestUnits(subjectId, gradeYear, 5);
      setUnits([...suggested, ...units]);
    } catch (error: any) {
      alert(error.message || 'Erro ao sugerir unidades');
    } finally {
      setSuggesting(false);
    }
  };

  const handleGenerateLessonPlan = async (unitId: string) => {
    try {
      const service = getLessonPlanService();
      await service.generateLessonPlanForUnit(unitId);
      // Recarrega as unidades
      const updatedUnits = service.getUnits(subjectId);
      setUnits(updatedUnits);
      alert('Plano de aula gerado com sucesso!');
    } catch (error: any) {
      alert(error.message || 'Erro ao gerar plano de aula');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!subject) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            ← Voltar
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            {subject.name}
          </h1>
          {subject.description && (
            <p className="text-sm text-gray-600 mt-1">{subject.description}</p>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ações */}
        <div className="flex gap-4 mb-6">
          <Link
            href={`/subjects/${subjectId}/units/new`}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            ➕ Nova Unidade
          </Link>
          <button
            onClick={handleSuggestUnits}
            disabled={suggesting}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {suggesting ? 'Sugerindo...' : '🤖 Sugerir Unidades (IA)'}
          </button>
        </div>

        {/* Unidades */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Unidades de Ensino ({units.length})
            </h2>
          </div>
          <div className="p-6">
            {units.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  Nenhuma unidade cadastrada ainda.
                </p>
                <p className="text-sm text-gray-400">
                  Crie manualmente ou use a IA para sugerir unidades.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {units.map((unit) => (
                  <div
                    key={unit.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{unit.topic}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {unit.gradeYear} • {unit.isSuggestedByAI ? '🤖 Sugerida por IA' : '✍️ Criada manualmente'}
                        </p>
                        {unit.description && (
                          <p className="text-sm text-gray-500 mt-2">{unit.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        {!unit.lessonPlanId && (
                          <button
                            onClick={() => handleGenerateLessonPlan(unit.id)}
                            className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition-colors"
                          >
                            Gerar Plano
                          </button>
                        )}
                        {unit.lessonPlanId && (
                          <Link
                            href={`/units/${unit.id}/lesson-plan`}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                          >
                            Ver Plano
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
