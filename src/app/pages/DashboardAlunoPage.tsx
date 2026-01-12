// src/app/pages/DashboardAlunoPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthService } from '@/lib/authService';
import { getLessonPlanService } from '@/lib/service';
import { HeaderWithAuth } from '@/components/layout/HeaderWithAuth';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import Link from 'next/link';
import type { SubjectViewModel, UnitViewModel } from '@/app/types';

export function DashboardAlunoPage() {
  const { user, isAluno } = useAuth();
  const authService = getAuthService();
  const lessonPlanService = getLessonPlanService();
  
  const [professor, setProfessor] = useState<any>(null);
  const [subjects, setSubjects] = useState<SubjectViewModel[]>([]);
  const [units, setUnits] = useState<UnitViewModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAluno && user?.professorId) {
      loadData();
    }
  }, [isAluno, user]);

  const loadData = () => {
    try {
      // Busca dados do professor
      const professorData = authService.getUserById(user!.professorId!);
      setProfessor(professorData);

      // Busca disciplinas e unidades
      const allSubjects = lessonPlanService.getSubjectsViewModels();
      const allUnits = lessonPlanService.getUnitsViewModels();

      // Para alunos, podemos mostrar todas as disciplinas/unidades ou filtrar por professor
      // Por enquanto, mostra todas (pode ser ajustado depois)
      setSubjects(allSubjects);
      setUnits(allUnits.filter(u => u.lessonPlanId)); // Apenas unidades com plano de aula
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderWithAuth
        title={`👨‍🎓 Bem-vindo, ${user?.name}`}
        subtitle={professor ? `Professor: ${professor.name}` : 'Visualize os materiais disponíveis'}
      />

      <PageContainer>
        {/* Info do Professor */}
        {professor && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">Seu Professor</h3>
            <p className="text-blue-800">{professor.name}</p>
            <p className="text-sm text-blue-600">{professor.email}</p>
          </div>
        )}

        {/* Disciplinas Disponíveis */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Disciplinas Disponíveis ({subjects.length})
            </h2>
          </div>
          <div className="p-6">
            {subjects.length === 0 ? (
              <EmptyState
                title="Nenhuma disciplina disponível"
                description="Aguarde seu professor cadastrar disciplinas"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((subject) => {
                  const subjectUnits = units.filter(u => u.subjectId === subject.id);
                  return (
                    <div
                      key={subject.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">{subject.name}</h3>
                      {subject.description && (
                        <p className="text-sm text-gray-600 mb-2">{subject.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mb-3">
                        {subjectUnits.length} {subjectUnits.length === 1 ? 'plano' : 'planos'} disponível{subjectUnits.length === 1 ? '' : 'eis'}
                      </p>
                      {subjectUnits.length > 0 && (
                        <Link
                          href={`/subjects/${subject.id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          Ver Planos →
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Planos de Aula Disponíveis */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Planos de Aula Disponíveis ({units.length})
            </h2>
          </div>
          <div className="p-6">
            {units.length === 0 ? (
              <EmptyState
                title="Nenhum plano de aula disponível"
                description="Aguarde seu professor gerar planos de aula"
              />
            ) : (
              <div className="space-y-3">
                {units.map((unit) => {
                  const subject = subjects.find(s => s.id === unit.subjectId);
                  return (
                    <Link
                      key={unit.id}
                      href={`/units/${unit.id}/lesson-plan`}
                      className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{unit.topic}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {subject?.name || 'Disciplina'}
                          </p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Disponível
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
