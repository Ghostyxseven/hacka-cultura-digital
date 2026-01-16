// src/app/(dashboards)/professor/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';
import { useSubjects, useUnits, useRecentUnits } from '@/hooks';
import { getClassService, getLessonPlanService } from '@/lib/service';
import { showError, showSuccess } from '@/utils/notifications';
import { Class } from '@/core/entities/Class';

// Components
import { Loading, PageSkeleton } from '@/components';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { AiSuggestionsWidget } from "@/app/components/AiSuggestionsWidget";
import {
  StatsSection,
  SubjectsList,
  UnitsList,
  ClassCard,
  ClassHealthWidget,
  TeacherCopilotWidget,
  RecentUnits
} from '@/app/components';
import { LazyTeacherMural } from '@/components/lazy';

export default function ProfessorPage() {
  const router = useRouter();
  const { user, isProfessor } = useAuth();
  const { subjects, loading: subjectsLoading, refresh: refreshSubjects } = useSubjects();
  const { units: allUnits, loading: unitsLoading, refresh: refreshUnits } = useUnits();
  const recentUnits = useRecentUnits(allUnits, 5);
  const lessonPlanService = getLessonPlanService();

  const [classes, setClasses] = useState<Class[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loading = subjectsLoading || unitsLoading || classesLoading;

  useEffect(() => {
    if (isProfessor && user?.id) {
      loadClasses();
    } else if (!isProfessor) {
      setClassesLoading(false);
    }
  }, [isProfessor, user]);

  const loadClasses = () => {
    try {
      setError(null);
      const classService = getClassService();
      const teacherClasses = classService.getTeacherClasses(user!.id);
      setClasses(teacherClasses);
    } catch (error: any) {
      console.error('Erro ao carregar turmas:', error);
      setError(error.message || 'Erro ao carregar turmas');
      showError(error.message || 'Erro ao carregar turmas');
    } finally {
      setClassesLoading(false);
    }
  };

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
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 p-8">
          <PageSkeleton />
        </main>
      </div>
    );
  }

  const handleDeleteSubject = (id: string) => {
    try {
      lessonPlanService.deleteSubject(id);
      showSuccess('Disciplina excluída com sucesso!');
      refreshSubjects();
      refreshUnits();
    } catch (error: any) {
      showError(error.message || 'Erro ao excluir disciplina');
    }
  };

  const handleDeleteUnit = (id: string) => {
    try {
      lessonPlanService.deleteUnit(id);
      showSuccess('Unidade excluída com sucesso!');
      refreshUnits();
    } catch (error: any) {
      showError(error.message || 'Erro ao excluir unidade');
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Header (Top Bar) */}
      <div className="bg-surface border-b border-border shadow-sm sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Greetings area */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <span className="text-xl sm:text-2xl">👋</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-text-main font-heading">
                  Olá, {user?.name?.split(' ')[0] || 'Professor'}!
                </h1>
                <p className="text-xs sm:text-sm text-text-secondary">
                  Hoje é um ótimo dia para ensinar.
                </p>
              </div>
            </div>

            {/* Right Side Info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-secondary/20 px-3 py-1.5 rounded-full text-secondary-foreground text-xs sm:text-sm font-medium">
                <span>📅</span>
                <span className="hidden sm:inline">2024 - 1º Bimestre</span>
                <span className="sm:hidden">1º Bim.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo da Página */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Seção de Estatísticas */}
          <div className="mb-8">
            <StatsSection
              stats={[
                {
                  title: 'Disciplinas',
                  value: subjects.length,
                  href: '/professor/disciplinas',
                  icon: '📚',
                  description: `${subjects.length === 0 ? 'Nenhuma' : subjects.length === 1 ? 'Uma' : subjects.length} disciplina${subjects.length !== 1 ? 's' : ''} cadastrada${subjects.length !== 1 ? 's' : ''}`
                },
                {
                  title: 'Unidades',
                  value: allUnits.length,
                  href: '/professor/disciplinas',
                  icon: '📖',
                  description: `${allUnits.length === 0 ? 'Nenhuma' : allUnits.length === 1 ? 'Uma' : allUnits.length} unidade${allUnits.length !== 1 ? 's' : ''} criada${allUnits.length !== 1 ? 's' : ''}`
                },
                {
                  title: 'Planos de Aula',
                  value: allUnits.filter(u => u.lessonPlanId).length,
                  href: '/professor/planos',
                  icon: '📝',
                  description: `${allUnits.filter(u => u.lessonPlanId).length} de ${allUnits.length} unidades com plano`
                },
                {
                  title: 'Turmas',
                  value: classes.length,
                  href: '/professor/turmas',
                  icon: '👥',
                  description: `${classes.length === 0 ? 'Nenhuma' : classes.length === 1 ? 'Uma' : classes.length} turma${classes.length !== 1 ? 's' : ''} ativa${classes.length !== 1 ? 's' : ''}`
                }
              ]}
            />
          </div>

           {/* Ações Rápidas - Cards Interativos */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
             <Button
               ariaLabel="Criar Aula com Inteligência Artificial"
               className="flex flex-col items-center justify-center gap-3 py-6 rounded-2xl min-h-[140px] bg-primary text-white shadow-lg hover:brightness-110 transition-transform hover:-translate-y-1"
               onClick={() => router.push('/professor/disciplinas/new')}
             >
               <span className="text-5xl bg-white/30 p-3 rounded-full">✨</span>
               <span className="font-bold text-lg leading-tight">Criar Aula com IA</span>
             </Button>

             <Button
               ariaLabel="Acessar Diário de Classe"
               className="flex flex-col items-center justify-center gap-3 py-6 rounded-2xl min-h-[140px] bg-white border-2 border-gray-300 text-gray-900 shadow-sm hover:border-primary hover:bg-primary/10 transition-transform hover:-translate-y-1"
               onClick={() => router.push('/professor/turmas')}
             >
               <span className="text-4xl">📝</span>
               <span className="font-semibold text-base leading-tight">Diário de Classe</span>
             </Button>

             <Button
               ariaLabel="Ver Meus Planos de Aula"
               className="flex flex-col items-center justify-center gap-3 py-6 rounded-2xl min-h-[140px] bg-white border-2 border-gray-300 text-gray-900 shadow-sm hover:border-primary hover:bg-primary/10 transition-transform hover:-translate-y-1"
               onClick={() => router.push('/professor/planos')}
             >
               <span className="text-4xl">📂</span>
               <span className="font-semibold text-base leading-tight">Meus Planos</span>
             </Button>

             <Button
               ariaLabel="Correção Assistida de Atividades"
               className="flex flex-col items-center justify-center gap-3 py-6 rounded-2xl min-h-[140px] bg-white border-2 border-gray-300 text-gray-900 shadow-sm hover:border-primary hover:bg-primary/10 transition-transform hover:-translate-y-1"
               onClick={() => showSuccess('Funcionalidade de Correção Assistida em breve!')}
             >
               <span className="text-4xl">✅</span>
               <span className="font-semibold text-base leading-tight">Corrigir</span>
             </Button>
           </div>

          {/* Widget IA (Sugestões Temáticas) */}
          <div className="mb-12">
            <AiSuggestionsWidget />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-8">

              {/* Unidades Recentes */}
              {recentUnits.length > 0 && (
                <RecentUnits units={recentUnits} subjects={subjects} />
              )}

              {/* Disciplinas */}
              <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gray-50/50">
                  <h3 className="font-heading font-bold text-lg text-text-main flex items-center gap-2">
                    <span>📚</span> Disciplinas
                  </h3>
                  <Link href="/professor/disciplinas/new">
                    <Button size="sm" variant="outline" className="text-xs h-8">
                      + Nova
                    </Button>
                  </Link>
                </div>
                <div className="p-4">
                  {subjects.length > 0 ? (
                    <SubjectsList
                      subjects={subjects}
                      units={allUnits}
                      showUnitCount
                      canDelete={true}
                      onDelete={handleDeleteSubject}
                    />
                  ) : (
                    <EmptyState
                      title="Nenhuma disciplina cadastrada"
                      description="Crie sua primeira disciplina para começar."
                      action={
                        <Link href="/professor/disciplinas/new">
                          <Button>Criar Disciplina</Button>
                        </Link>
                      }
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Direita (Saúde da Turma) */}
            <div className="space-y-8">
              <ClassHealthWidget classes={classes} />

              {/* Mini Lista de Turmas */}
              {classes.length > 0 && (
                <div className="bg-surface rounded-2xl shadow-sm border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-text-main">Minhas Turmas</h3>
                    <Link href="/professor/turmas" className="text-sm text-primary hover:underline">Ver todas</Link>
                  </div>
                  <div className="space-y-3">
                    {classes.slice(0, 4).map(c => (
                      <div key={c.id} className="p-3 rounded-lg border border-border hover:border-primary/30 transition-colors flex items-center justify-between cursor-pointer" onClick={() => router.push(`/professor/turmas/${c.id}`)}>
                        <span className="font-medium text-text-main">{c.name}</span>
                        <span className="text-xs text-text-secondary">{c.gradeYear}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mural (Lazy Loaded) */}
          <div className="mt-12">
            <LazyTeacherMural />
          </div>

        </div>
      </main>

      {/* Copilot Flutuante */}
      <TeacherCopilotWidget />
    </div>
  );
}
