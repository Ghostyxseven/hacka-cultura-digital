// src/app/(dashboards)/professor/turmas/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PageContainer } from '@/components';
import { Button } from '@/components/ui/Button';
import { ClassTeacherList, ClassStudentList } from '@/app/components';
import { Class } from '@/core/entities/Class';
import { ClassTeacherInfo } from '@/application/usecases/GetClassTeachersUseCase';
import { getClassService, getLessonPlanService } from '@/lib/service';
import Link from 'next/link';

export default function ProfessorTurmaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isProfessor } = useAuth();
  const classId = params.id as string;

  const [classEntity, setClassEntity] = useState<Class | null>(null);
  const [teachers, setTeachers] = useState<ClassTeacherInfo[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const lessonPlanService = getLessonPlanService();

  useEffect(() => {
    if (isProfessor && classId) {
      loadData();
    }
  }, [isProfessor, classId]);

  const loadData = () => {
    try {
      const classService = getClassService();
      const classData = classService.getClassById(classId);
      setClassEntity(classData || null);

      if (classData) {
        const teachersData = classService.getClassTeachers(classId);
        setTeachers(teachersData);

        const studentsData = classService.getClassStudents(classId);
        setStudents(studentsData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados da turma:', error);
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

  if (loading) {
    return (
      <PageContainer>
        <div className="text-center py-12 text-gray-500">Carregando...</div>
      </PageContainer>
    );
  }

  if (!classEntity) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-red-600">Turma não encontrada.</p>
          <Button onClick={() => router.push('/professor/turmas')} className="mt-4">
            Voltar para Turmas
          </Button>
        </div>
      </PageContainer>
    );
  }

  // Verifica se o professor leciona nesta turma
  const isTeacherInClass = classEntity.teachers.some(t => t.teacherId === user?.id);
  if (!isTeacherInClass) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-red-600">Você não leciona nesta turma.</p>
          <Button onClick={() => router.push('/professor/turmas')} className="mt-4">
            Voltar para Turmas
          </Button>
        </div>
      </PageContainer>
    );
  }

  const subjects = lessonPlanService.getSubjects();
  const teacherSubjects = classEntity.teachers
    .filter(t => t.teacherId === user?.id)
    .map(t => subjects.find(s => s.id === t.subjectId))
    .filter(Boolean);

  return (
    <PageContainer>
      <div className="mb-6">
        <Button onClick={() => router.push('/professor/turmas')} variant="secondary">
          ← Voltar
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{classEntity.name}</h1>
        <div className="flex items-center gap-4 text-gray-600">
          <span>📚 {classEntity.gradeYear}</span>
          <span>📅 {classEntity.schoolYear}</span>
          <span>👨‍🎓 {students.length} alunos</span>
        </div>
      </div>

      {/* Disciplinas que o professor leciona nesta turma */}
      {teacherSubjects.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Disciplinas que você leciona</h2>
          <div className="flex flex-wrap gap-2">
            {teacherSubjects.map((subject) => (
              <span
                key={subject!.id}
                className="px-4 py-2 bg-primary-100 text-primary-800 rounded-lg font-medium"
              >
                {subject!.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Professores da Turma */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Professores da Turma</h2>
        <ClassTeacherList
          teachers={teachers}
          subjects={subjects}
        />
      </div>

      {/* Alunos da Turma */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Alunos da Turma</h2>
        <ClassStudentList
          students={students}
        />
      </div>
    </PageContainer>
  );
}
