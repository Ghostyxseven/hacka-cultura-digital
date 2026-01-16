// src/app/components/ClassStudentList.tsx
'use client';

import { useState } from 'react';
import { User } from '@/core/entities/User';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';

interface ClassStudentListProps {
  students: User[];
  loading?: boolean;
  onRemove?: (studentId: string) => void;
  showRemoveButton?: boolean;
}

/**
 * Componente para listar alunos de uma turma
 */
export function ClassStudentList({
  students,
  loading = false,
  onRemove,
  showRemoveButton = false,
}: ClassStudentListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Carregando...</div>;
  }

  // Filtra alunos por busca
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (students.length === 0) {
    return (
      <EmptyState
        title="Nenhum aluno na turma"
        description="Adicione alunos a esta turma para começar"
      />
    );
  }

  return (
    <div className="space-y-4">
      {students.length > 5 && (
        <div className="mb-4">
          <Input
            id="search"
            label="Buscar aluno"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite o nome ou email..."
          />
        </div>
      )}

      <div className="space-y-2">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum aluno encontrado com "{searchTerm}"
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
              </div>
              {showRemoveButton && onRemove && (
                <button
                  onClick={() => onRemove(student.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Remover
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {filteredStudents.length > 0 && (
        <div className="text-sm text-gray-500 text-center pt-2 border-t border-gray-200">
          {filteredStudents.length} de {students.length} aluno{students.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
