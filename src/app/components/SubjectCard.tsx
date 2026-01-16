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
    <article
      className="group relative bg-surface border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
      aria-label={`Disciplina: ${subject.name}`}
    >
      {/* Gradiente sutil no hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-300 pointer-events-none" aria-hidden="true" />

      <div className="relative flex items-start justify-between">
        <Link
          href={subjectHref}
          className="flex-1 block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
          aria-label={`Ver detalhes da disciplina ${subject.name}`}
        >
          <div className="flex items-start gap-4">
            {/* Ícone da disciplina */}
            <div
              className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300"
              aria-hidden="true"
            >
              {subject.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl text-text-main mb-2 group-hover:text-primary transition-colors">
                {subject.name}
              </h3>
              {subject.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {subject.description}
                </p>
              )}
              {showUnitCount && unitCount !== undefined && (
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary-700 text-sm font-semibold border border-primary/20 shadow-sm"
                  aria-label={`${unitCount} ${unitCount === 1 ? 'unidade' : 'unidades'}`}
                >
                  <span className="text-primary-600" aria-hidden="true">📚</span>
                  <span>{unitCount} {unitCount === 1 ? 'unidade' : 'unidades'}</span>
                </div>
              )}
            </div>
          </div>
        </Link>
        {canDelete && onDelete && (
          <div
            className="ml-3 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
            role="group"
            aria-label={`Ações para disciplina ${subject.name}`}
          >
            <ConfirmDeleteButton
              onConfirm={handleDelete}
              itemName={subject.name}
              ariaLabel={`Excluir disciplina ${subject.name}`}
            />
          </div>
        )}
      </div>
    </article>
  );
}
