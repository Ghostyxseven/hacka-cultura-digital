// src/app/(dashboards)/admin/turmas/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PageContainer } from '@/components';
import { Button, Select } from '@/components';
import { ClassTeacherList } from '@/app/components/ClassTeacherList';
import { ClassStudentList } from '@/app/components/ClassStudentList';
import { Class } from '@/core/entities/Class';
import { User } from '@/core/entities/User';
import { GetClassByIdUseCase } from '@/application/usecases/GetClassByIdUseCase';
import { GetClassTeachersUseCase, ClassTeacherInfo } from '@/application/usecases/GetClassTeachersUseCase';
import { GetClassStudentsUseCase } from '@/application/usecases/GetClassStudentsUseCase';
import { AssignTeacherToClassUseCase } from '@/application/usecases/AssignTeacherToClassUseCase';
import { AssignStudentToClassUseCase } from '@/application/usecases/AssignStudentToClassUseCase';
import { RemoveTeacherFromClassUseCase } from '@/application/usecases/RemoveTeacherFromClassUseCase';
import { RemoveStudentFromClassUseCase } from '@/application/usecases/RemoveStudentFromClassUseCase';
import { LocalStorageClassRepository } from '@/repository/implementations/LocalStorageClassRepository';
import { LocalStorageUserRepository } from '@/repository/implementations/LocalStorageUserRepository';
import { getLessonPlanService } from '@/lib/service';
import { showSuccess, showError } from '@/utils/notifications';

export default function TurmaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const classId = params.id as string;

  const [classEntity, setClassEntity] = useState<Class | null>(null);
  const [teachers, setTeachers] = useState<ClassTeacherInfo[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Formulários
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');

  const classRepository = LocalStorageClassRepository.getInstance();
  const userRepository = LocalStorageUserRepository.getInstance();
  const lessonPlanService = getLessonPlanService();

  useEffect(() => {
    if (isAdmin && classId) {
      loadData();
    }
  }, [isAdmin, classId]);

  const loadData = () => {
    try {
      const getClassUseCase = new GetClassByIdUseCase(classRepository);
      const classData = getClassUseCase.execute(classId);
      setClassEntity(classData || null);

      if (classData) {
        const getTeachersUseCase = new GetClassTeachersUseCase(classRepository, userRepository);
        const teachersData = getTeachersUseCase.execute(classId);
        setTeachers(teachersData);

        const getStudentsUseCase = new GetClassStudentsUseCase(classRepository, userRepository);
        const studentsData = getStudentsUseCase.execute(classId);
        setStudents(studentsData);
      }
    } catch (error) {
      showError('Erro ao carregar dados da turma');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = () => {
    if (!selectedTeacherId || !selectedSubjectId) {
      showError('Selecione professor e disciplina');
      return;
    }

    try {
      const assignUseCase = new AssignTeacherToClassUseCase(classRepository, userRepository);
      assignUseCase.execute(classId, selectedTeacherId, selectedSubjectId);
      showSuccess('Professor associado com sucesso!');
      setShowAddTeacher(false);
      setSelectedTeacherId('');
      setSelectedSubjectId('');
      loadData();
    } catch (error: any) {
      showError(error.message || 'Erro ao associar professor');
    }
  };

  const handleAddStudent = () => {
    if (!selectedStudentId) {
      showError('Selecione um aluno');
      return;
    }

    try {
      const assignUseCase = new AssignStudentToClassUseCase(classRepository, userRepository);
      assignUseCase.execute(classId, selectedStudentId);
      showSuccess('Aluno associado com sucesso!');
      setShowAddStudent(false);
      setSelectedStudentId('');
      loadData();
    } catch (error: any) {
      showError(error.message || 'Erro ao associar aluno');
    }
  };

  const handleRemoveTeacher = (teacherId: string, subjectId: string) => {
    try {
      const removeUseCase = new RemoveTeacherFromClassUseCase(classRepository, userRepository);
      removeUseCase.execute(classId, teacherId, subjectId);
      showSuccess('Professor removido com sucesso!');
      loadData();
    } catch (error: any) {
      showError(error.message || 'Erro ao remover professor');
    }
  };

  const handleRemoveStudent = (studentId: string) => {
    try {
      const removeUseCase = new RemoveStudentFromClassUseCase(classRepository, userRepository);
      removeUseCase.execute(classId, studentId);
      showSuccess('Aluno removido com sucesso!');
      loadData();
    } catch (error: any) {
      showError(error.message || 'Erro ao remover aluno');
    }
  };

  if (!isAdmin) {
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
          <Button onClick={() => router.push('/admin/turmas')} className="mt-4">
            Voltar para Turmas
          </Button>
        </div>
      </PageContainer>
    );
  }

  const allTeachers = userRepository.getUsersByRole('professor');
  const allStudents = userRepository.getUsersByRole('aluno').filter(s => !s.classId || s.classId === classId);
  const allSubjects = lessonPlanService.getSubjects();

  const availableTeachers = allTeachers.filter(t => 
    t.subjects?.includes(selectedSubjectId) || !selectedSubjectId
  );

  return (
    <PageContainer>
      <div className="mb-6">
        <Button onClick={() => router.push('/admin/turmas')} variant="secondary">
          ← Voltar
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{classEntity.name}</h1>
        <div className="flex items-center gap-4 text-gray-600">
          <span>📚 {classEntity.gradeYear}</span>
          <span>📅 {classEntity.schoolYear}</span>
          <span>👨‍🎓 {students.length} alunos</span>
          <span>👥 {teachers.length} professores</span>
        </div>
      </div>

      {/* Professores */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Professores</h2>
          <Button
            onClick={() => setShowAddTeacher(!showAddTeacher)}
            variant="primary"
            size="sm"
          >
            + Adicionar Professor
          </Button>
        </div>

        {showAddTeacher && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Select
                id="subject"
                label="Disciplina"
                value={selectedSubjectId}
                onChange={(e) => {
                  setSelectedSubjectId(e.target.value);
                  setSelectedTeacherId('');
                }}
                placeholder="Selecione a disciplina"
                options={allSubjects.map(s => ({ value: s.id, label: s.name }))}
                required
              />
              <Select
                id="teacher"
                label="Professor"
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                placeholder="Selecione o professor"
                options={availableTeachers.map(t => ({ value: t.id, label: t.name }))}
                required
                disabled={!selectedSubjectId}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddTeacher}>Adicionar</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowAddTeacher(false);
                  setSelectedTeacherId('');
                  setSelectedSubjectId('');
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        <ClassTeacherList
          teachers={teachers}
          subjects={allSubjects}
        />
      </div>

      {/* Alunos */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Alunos</h2>
          <Button
            onClick={() => setShowAddStudent(!showAddStudent)}
            variant="primary"
            size="sm"
          >
            + Adicionar Aluno
          </Button>
        </div>

        {showAddStudent && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Select
              id="student"
              label="Aluno"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              placeholder="Selecione o aluno"
              options={allStudents.map(s => ({ value: s.id, label: `${s.name} (${s.email})` }))}
              required
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddStudent}>Adicionar</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowAddStudent(false);
                  setSelectedStudentId('');
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        <ClassStudentList
          students={students}
          showRemoveButton
          onRemove={handleRemoveStudent}
        />
      </div>
    </PageContainer>
  );
}
