// src/app/components/SubjectCard.tsx
// Componente reutilizável para card de disciplina
'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import type { SubjectViewModel } from '@/application/viewmodels';
import { ConfirmDeleteButton } from '@/components';

interface SubjectCardProps {
  subject: SubjectViewModel;
  unitCount?: number;
  showUnitCount?: boolean;
  onDelete?: (id: string) => void;
  canDelete?: boolean;
}

export function SubjectCard({ 
  subject, 
  unitCount, 
  showUnitCount = false,
  onDelete,
  canDelete = false
}: SubjectCardProps) {
  const { isProfessor, isAdmin } = useAuth();
  const isAluno = !isProfessor && !isAdmin;
  
  // Define a rota baseada no tipo de usuário
  const subjectHref = isAluno ? `/aluno/disciplinas/${subject.id}` : `/professor/disciplinas/${subject.id}`;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(subject.id);
    }
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-primary-300 transition-all duration-200">
      <Link href={subjectHref} className="block">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
              {subject.name}
            </h3>
            {subject.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {subject.description}
              </p>
            )}
            {showUnitCount && unitCount !== undefined && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
                {unitCount} {unitCount === 1 ? 'unidade' : 'unidades'}
              </div>
            )}
          </div>
          {canDelete && onDelete && (
            <div className="ml-3 flex-shrink-0" onClick={(e) => e.preventDefault()}>
              <ConfirmDeleteButton
                onConfirm={handleDelete}
                itemName={subject.name}
              />
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
