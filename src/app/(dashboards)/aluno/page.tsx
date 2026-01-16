// src/app/(dashboards)/aluno/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthService } from '@/lib/authService';
import { getGetQuizResultsUseCase } from '@/lib/quizService';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { SubjectsList, UnitsList, StatsSection, ClassTeacherList } from '@/app/components';
import { LazyTeacherMural } from '@/components/lazy';
import { PresentationMapper } from '@/application';
import { getClassService, getLessonPlanService } from '@/lib/service';
import { ClassTeacherInfo } from '@/application/usecases/GetClassTeachersUseCase';
import type { SubjectViewModel, UnitViewModel } from '@/application/viewmodels';
import type { QuizResult } from '@/core/entities/QuizResult';
import type { User } from '@/core/entities/User';
import type { Class } from '@/core/entities/Class';
import Link from 'next/link';

export default function AlunoPage() {
  const { user, isAluno } = useAuth();
  const authService = getAuthService();
  const lessonPlanService = getLessonPlanService();

  const [classEntity, setClassEntity] = useState<Class | null>(null);
  const [teachers, setTeachers] = useState<ClassTeacherInfo[]>([]);
  const [professor, setProfessor] = useState<User | null>(null);
  const [subjects, setSubjects] = useState<SubjectViewModel[]>([]);
  const [units, setUnits] = useState<UnitViewModel[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    if (isAluno && user) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAluno, user]);

  const loadData = () => {
    try {
      // Busca turma do aluno (sistema novo)
      if (user!.classId) {
        const classService = getClassService();
        const classData = classService.getClassById(user!.classId);
        setClassEntity(classData || null);

        if (classData) {
          const teachersData = classService.getClassTeachers(user!.classId);
          setTeachers(teachersData);
        }
      }

      // Sistema antigo (compatibilidade) - busca professor direto
      if (user!.professorId && !user!.classId) {
        const professorData = authService.getUserById(user!.professorId);
        setProfessor(professorData || null);
      }

      const allSubjects = lessonPlanService.getSubjects().map(s => PresentationMapper.toSubjectViewModel(s));
      const allUnits = lessonPlanService.getUnits().map(u => PresentationMapper.toUnitViewModel(u));

      const quizUseCase = getGetQuizResultsUseCase();
      const results = quizUseCase.getByUserId(user!.id);
      setQuizResults(results);

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

  // Estatísticas para o dashboard
  const stats = [
    { title: 'Disciplinas', value: subjects.length },
    { title: 'Planos de Aula', value: units.length },
    { title: 'Unidades com Planos', value: units.length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Header com gradiente moderno */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-xl border-b border-blue-700/20">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="text-5xl">👨‍🎓</span>
              <span>Dashboard Aluno</span>
            </h1>
            <p className="text-blue-100 text-lg">Visualize e acesse os materiais disponíveis do seu professor</p>
          </div>
        </div>
      </div>

      <PageContainer>
        {/* Card da Turma - Destaque */}
        {classEntity && (
          <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-6 mb-8 text-white transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-6 flex-1">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0 shadow-lg">
                  🏫
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🏫</span>
                    <h3 className="font-bold text-2xl">Minha Turma</h3>
                  </div>
                  <p className="text-xl font-semibold mb-1">{classEntity.name}</p>
                  <div className="flex items-center gap-4 text-blue-100 text-sm">
                    <span>📚 {classEntity.gradeYear}</span>
                    <span>📅 {classEntity.schoolYear}</span>
                  </div>
                </div>
              </div>
              <Link href={`/aluno/turma`}>
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  Ver Detalhes
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Professores da Turma */}
        {classEntity && teachers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Professores da Turma</h2>
            <ClassTeacherList
              teachers={teachers}
              subjects={lessonPlanService.getSubjects()}
            />
          </div>
        )}

        {/* Card do Professor - Sistema Antigo (compatibilidade) */}
        {!classEntity && professor && (
          <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-6 mb-8 text-white transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0 shadow-lg">
                {professor.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">👨‍🏫</span>
                  <h3 className="font-bold text-2xl">Seu Professor</h3>
                </div>
                <p className="text-xl font-semibold mb-1">{professor.name}</p>
                <p className="text-blue-100 text-sm flex items-center gap-2">
                  <span>📧</span>
                  <span>{professor.email}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mural de Avisos do Professor */}
        <div className="mb-8">
          <LazyTeacherMural />
        </div>

        {/* Estatísticas */}
        {subjects.length > 0 || units.length > 0 ? (
          <div className="mb-8">
            <StatsSection stats={stats} />
          </div>
        ) : null}

        {/* Seção de Disciplinas */}
        {subjects.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center mb-8">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-5xl">📚</span>
              </div>
              <EmptyState
                title="Nenhuma disciplina disponível ainda"
                description="Aguarde seu professor cadastrar disciplinas para começar a estudar"
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200 mb-8 transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 px-6 py-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📚</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Disciplinas Disponíveis
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {subjects.length} {subjects.length === 1 ? 'disciplina cadastrada' : 'disciplinas cadastradas'}
                  </p>
                </div>
              </div>
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
        )}

        {/* Seção de Planos de Aula */}
        {units.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <span className="text-5xl">📖</span>
              </div>
              <EmptyState
                title="Nenhum plano de aula disponível ainda"
                description="Aguarde seu professor gerar planos de aula para começar seus estudos"
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200 transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 px-6 py-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📖</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Planos de Aula Disponíveis
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {units.length} {units.length === 1 ? 'plano de aula disponível' : 'planos de aula disponíveis'}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <UnitsList
                units={units}
                subjects={subjects}
                quizResults={quizResults}
                showSubject
                emptyStateTitle="Nenhum plano de aula disponível"
                emptyStateDescription="Aguarde seu professor gerar planos de aula"
              />
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
