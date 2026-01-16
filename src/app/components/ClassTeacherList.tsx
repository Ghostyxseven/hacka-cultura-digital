// src/app/components/ClassTeacherList.tsx
'use client';

import { GetClassTeachersUseCase, ClassTeacherInfo } from '@/application/usecases/GetClassTeachersUseCase';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';

interface ClassTeacherListProps {
  teachers: ClassTeacherInfo[];
  subjects?: Array<{ id: string; name: string }>;
  loading?: boolean;
}

/**
 * Componente para listar professores de uma turma agrupados por disciplina
 */
export function ClassTeacherList({ teachers, subjects = [], loading = false }: ClassTeacherListProps) {
  if (loading) {
    return <Loading />;
  }

  if (teachers.length === 0) {
    return (
      <EmptyState
        title="Nenhum professor associado"
        description="Adicione professores a esta turma para começar"
      />
    );
  }

  // Agrupa professores por disciplina
  const teachersBySubject = teachers.reduce((acc, teacherInfo) => {
    const subjectId = teacherInfo.subjectId;
    if (!acc[subjectId]) {
      acc[subjectId] = [];
    }
    acc[subjectId].push(teacherInfo);
    return acc;
  }, {} as Record<string, ClassTeacherInfo[]>);

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || `Disciplina ${subjectId}`;
  };

  return (
    <div className="space-y-4">
      {Object.entries(teachersBySubject).map(([subjectId, teachersList]) => (
        <div key={subjectId} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>📚</span>
            <span>{getSubjectName(subjectId)}</span>
          </h4>
          <div className="space-y-2">
            {teachersList.map((teacherInfo) => (
              <div
                key={`${teacherInfo.teacher.id}-${subjectId}`}
                className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                    {teacherInfo.teacher.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{teacherInfo.teacher.name}</p>
                    <p className="text-sm text-gray-500">{teacherInfo.teacher.email}</p>
                  </div>
                </div>
                {teacherInfo.isMainTeacher && (
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    Coordenador
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
