// src/app/components/ClassCard.tsx
'use client';

import Link from 'next/link';
import { Class } from '@/core/entities/Class';
import { Button } from '@/components/ui/Button';

interface ClassCardProps {
  classEntity: Class;
  showActions?: boolean;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

/**
 * Componente de card para exibir informações de uma turma
 */
export function ClassCard({ classEntity, showActions = false, onDelete, onView }: ClassCardProps) {
  const studentCount = classEntity.students.length;
  const teacherCount = classEntity.teachers.length;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 p-6 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{classEntity.name}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <span>📚</span>
              <span>{classEntity.gradeYear}</span>
            </span>
            <span className="flex items-center gap-1">
              <span>📅</span>
              <span>{classEntity.schoolYear}</span>
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">{studentCount}</div>
          <div className="text-xs text-gray-500">alunos</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <span>👥</span>
          <span>{teacherCount} professor{teacherCount !== 1 ? 'es' : ''}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>👨‍🎓</span>
          <span>{studentCount} aluno{studentCount !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
          {onView && (
            <Link href={`/admin/turmas/${classEntity.id}`} className="flex-1">
              <Button variant="primary" className="w-full">
                Ver Detalhes
              </Button>
            </Link>
          )}
          {onDelete && (
            <Button
              variant="danger"
              onClick={() => onDelete(classEntity.id)}
              className="flex-1"
            >
              Excluir
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
