// src/app/components/SubjectCard.tsx
// Componente reutilizável para card de disciplina
'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { SubjectViewModel } from '@/app/types';
import { Button } from '@/components/ui/Button';

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Define a rota baseada no tipo de usuário
  const subjectHref = isAluno ? `/aluno/disciplinas/${subject.id}` : `/professor/disciplinas/${subject.id}`;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (showConfirm && onDelete) {
      setIsDeleting(true);
      onDelete(subject.id);
      setTimeout(() => {
        setIsDeleting(false);
        setShowConfirm(false);
      }, 500);
    } else {
      setShowConfirm(true);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(false);
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
            <div className="ml-3 flex-shrink-0">
              {!showConfirm ? (
                <button
                  onClick={handleDelete}
                  className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                  title="Excluir disciplina"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              ) : (
                <div className="flex gap-2 opacity-100">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                    title="Confirmar exclusão"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleCancelDelete}
                    className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
                    title="Cancelar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
