// src/app/(dashboards)/aluno/turma/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PageContainer } from '@/components';
import { Button } from '@/components/ui/Button';
import { ClassTeacherList, ClassStudentList } from '@/app/components';
import { Class } from '@/core/entities/Class';
import { GetClassByIdUseCase } from '@/application/usecases/GetClassByIdUseCase';
import { GetClassTeachersUseCase, ClassTeacherInfo } from '@/application/usecases/GetClassTeachersUseCase';
import { GetClassStudentsUseCase } from '@/application/usecases/GetClassStudentsUseCase';
import { LocalStorageClassRepository } from '@/repository/implementations/LocalStorageClassRepository';
import { LocalStorageUserRepository } from '@/repository/implementations/LocalStorageUserRepository';
import { getLessonPlanService } from '@/lib/service';

export default function AlunoTurmaPage() {
  const router = useRouter();
  const { user, isAluno } = useAuth();

  const [classEntity, setClassEntity] = useState<Class | null>(null);
  const [teachers, setTeachers] = useState<ClassTeacherInfo[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const classRepository = LocalStorageClassRepository.getInstance();
  const userRepository = LocalStorageUserRepository.getInstance();
  const lessonPlanService = getLessonPlanService();

  useEffect(() => {
    if (isAluno && user?.classId) {
      loadData();
    }
  }, [isAluno, user]);

  const loadData = () => {
    try {
      const getClassUseCase = new GetClassByIdUseCase(classRepository);
      const classData = getClassUseCase.execute(user!.classId!);
      setClassEntity(classData || null);

      if (classData) {
        const getTeachersUseCase = new GetClassTeachersUseCase(classRepository, userRepository);
        const teachersData = getTeachersUseCase.execute(user!.classId!);
        setTeachers(teachersData);

        const getStudentsUseCase = new GetClassStudentsUseCase(classRepository, userRepository);
        const studentsData = getStudentsUseCase.execute(user!.classId!);
        setStudents(studentsData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados da turma:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAluno) {
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

  if (!user?.classId || !classEntity) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Você ainda não está associado a uma turma.</p>
          <p className="text-sm text-gray-500">Entre em contato com o administrador para ser associado a uma turma.</p>
          <Button onClick={() => router.push('/aluno')} className="mt-4">
            Voltar para Dashboard
          </Button>
        </div>
      </PageContainer>
    );
  }

  const subjects = lessonPlanService.getSubjects();

  return (
    <PageContainer>
      <div className="mb-6">
        <Button onClick={() => router.push('/aluno')} variant="secondary">
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Colegas de Turma</h2>
        <ClassStudentList
          students={students.filter(s => s.id !== user.id)}
        />
      </div>
    </PageContainer>
  );
}
