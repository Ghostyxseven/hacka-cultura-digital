// src/app/pages/components/SubjectsList.tsx
// Componente reutilizável para lista de disciplinas
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { SubjectCard } from './SubjectCard';
import type { SubjectViewModel, UnitViewModel } from '@/app/types';
import Link from 'next/link';

interface SubjectsListProps {
  subjects: SubjectViewModel[];
  units?: UnitViewModel[];
  showEmptyState?: boolean;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateAction?: React.ReactNode;
  showUnitCount?: boolean;
  onDelete?: (id: string) => void;
  canDelete?: boolean;
}

export function SubjectsList({
  subjects,
  units = [],
  showEmptyState = true,
  emptyStateTitle = 'Nenhuma disciplina cadastrada',
  emptyStateDescription,
  emptyStateAction,
  showUnitCount = false,
  onDelete,
  canDelete = false,
}: SubjectsListProps) {
  if (subjects.length === 0 && showEmptyState) {
    return (
      <EmptyState
        title={emptyStateTitle}
        description={emptyStateDescription}
        action={emptyStateAction}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subjects.map((subject) => {
        const unitCount = units.filter(u => u.subjectId === subject.id).length;
        return (
          <SubjectCard
            key={subject.id}
            subject={subject}
            unitCount={showUnitCount ? unitCount : undefined}
            showUnitCount={showUnitCount}
            onDelete={onDelete}
            canDelete={canDelete}
          />
        );
      })}
    </div>
  );
}
