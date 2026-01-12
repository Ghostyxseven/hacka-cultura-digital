// src/app/(dashboards)/aluno/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthService } from '@/lib/authService';
import { getLessonPlanService } from '@/lib/service';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { SubjectsList, UnitsList } from '@/app/components';
import Link from 'next/link';
import type { SubjectViewModel, UnitViewModel } from '@/app/types';
import type { User } from '@/core/entities/User';

export default function AlunoPage() {
  const { user, isAluno } = useAuth();
  const authService = getAuthService();
  const lessonPlanService = getLessonPlanService();
  
  const [professor, setProfessor] = useState<User | null>(null);
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
      const professorData = authService.getUserById(user!.professorId!);
      setProfessor(professorData || null);

      const allSubjects = lessonPlanService.getSubjectsViewModels();
      const allUnits = lessonPlanService.getUnitsViewModels();

      setSubjects(allSubjects);
      setUnits(allUnits.filter(u => u.lessonPlanId));
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
      <PageContainer>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Aluno</h1>
          <p className="text-gray-600">Visualize os materiais disponíveis do seu professor</p>
        </div>

        {professor && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 mb-8 shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {professor.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-blue-900 mb-1 text-lg">👨‍🏫 Seu Professor</h3>
                <p className="text-blue-800 font-medium">{professor.name}</p>
                <p className="text-sm text-blue-600">{professor.email}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-200 mb-8 transition-all duration-200">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-xl font-bold text-gray-900">
              Disciplinas Disponíveis ({subjects.length})
            </h2>
          </div>
          <div className="p-6">
            <SubjectsList
              subjects={subjects}
              units={units}
              showUnitCount
              emptyStateTitle="Nenhuma disciplina disponível"
              emptyStateDescription="Aguarde seu professor cadastrar disciplinas"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-200">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-xl font-bold text-gray-900">
              Planos de Aula Disponíveis ({units.length})
            </h2>
          </div>
          <div className="p-6">
            <UnitsList
              units={units}
              subjects={subjects}
              showSubject
              emptyStateTitle="Nenhum plano de aula disponível"
              emptyStateDescription="Aguarde seu professor gerar planos de aula"
            />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
