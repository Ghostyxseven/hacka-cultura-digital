// src/app/(dashboards)/professor/turmas/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageContainer } from '@/components';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components';
import { ClassCard } from '@/app/components/ClassCard';
import { Class } from '@/core/entities/Class';
import { getClassService, getLessonPlanService } from '@/lib/service';
import Link from 'next/link';

export default function ProfessorTurmasPage() {
  const { user, isProfessor } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSubjectId, setFilterSubjectId] = useState('');

  const lessonPlanService = getLessonPlanService();

  useEffect(() => {
    if (isProfessor && user?.id) {
      loadClasses();
    }
  }, [isProfessor, user, filterSubjectId]);

  const loadClasses = () => {
    try {
      const classService = getClassService();
      const teacherClasses = classService.getTeacherClasses(
        user!.id,
        filterSubjectId || undefined
      );
      setClasses(teacherClasses);
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isProfessor) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-red-600">Acesso negado.</p>
        </div>
      </PageContainer>
    );
  }

  const subjects = lessonPlanService.getSubjects();
  const teacherSubjects = subjects.filter(s => user?.subjects?.includes(s.id));

  return (
    <PageContainer>
      <div className="mb-6">
        <Link href="/professor">
          <Button variant="secondary">← Voltar</Button>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Minhas Turmas</h1>
        <p className="text-gray-600">Gerencie as turmas em que você leciona</p>
      </div>

      {/* Filtro por Disciplina */}
      {teacherSubjects.length > 0 && (
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
          <Select
            id="filterSubject"
            label="Filtrar por Disciplina"
            value={filterSubjectId}
            onChange={(e) => setFilterSubjectId(e.target.value)}
            placeholder="Todas as disciplinas"
            options={[
              { value: '', label: 'Todas as disciplinas' },
              ...teacherSubjects.map(s => ({ value: s.id, label: s.name })),
            ]}
          />
        </div>
      )}

      {/* Lista de Turmas */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Carregando...</div>
      ) : classes.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">
            {filterSubjectId
              ? 'Nenhuma turma encontrada para esta disciplina.'
              : 'Você ainda não está associado a nenhuma turma. Entre em contato com o administrador.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classEntity) => (
            <Link key={classEntity.id} href={`/professor/turmas/${classEntity.id}`}>
              <ClassCard
                classEntity={classEntity}
                showActions={false}
              />
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
