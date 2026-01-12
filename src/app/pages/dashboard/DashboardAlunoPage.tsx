// src/app/pages/dashboard/DashboardAlunoPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthService } from '@/lib/authService';
import { getLessonPlanService } from '@/lib/service';
import { HeaderWithAuth } from '@/components/layout/HeaderWithAuth';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { SubjectsList, UnitsList } from '../components';
import Link from 'next/link';
import type { SubjectViewModel, UnitViewModel } from '@/app/types';
import type { User } from '@/core/entities/User';

export function DashboardAlunoPage() {
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
      <HeaderWithAuth
        title={`👨‍🎓 Bem-vindo, ${user?.name}`}
        subtitle={professor ? `Professor: ${professor.name}` : 'Visualize os materiais disponíveis'}
      />

      <PageContainer>
        {professor && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">Seu Professor</h3>
            <p className="text-blue-800">{professor.name}</p>
            <p className="text-sm text-blue-600">{professor.email}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
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

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
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
