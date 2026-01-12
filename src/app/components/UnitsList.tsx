// src/app/pages/components/UnitsList.tsx
// Componente reutilizável para lista de unidades
import { EmptyState } from '@/components/ui/EmptyState';
import { UnitCard } from './UnitCard';
import type { UnitViewModel, SubjectViewModel } from '@/app/types';

interface UnitsListProps {
  units: UnitViewModel[];
  subjects?: SubjectViewModel[];
  canGenerate?: boolean;
  onGenerate?: (unitId: string) => void;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  showSubject?: boolean;
  onDelete?: (id: string) => void;
  canDelete?: boolean;
}

export function UnitsList({
  units,
  subjects = [],
  canGenerate = false,
  onGenerate,
  emptyStateTitle = 'Nenhuma unidade cadastrada',
  emptyStateDescription,
  showSubject = false,
  onDelete,
  canDelete = false,
}: UnitsListProps) {
  if (units.length === 0) {
    return (
      <EmptyState
        title={emptyStateTitle}
        description={emptyStateDescription}
      />
    );
  }

  return (
    <div className="space-y-4">
      {units.map((unit) => {
        const subject = subjects.find(s => s.id === unit.subjectId);
        return (
          <UnitCard
            key={unit.id}
            unit={unit}
            subjectName={subject?.name}
            canGenerate={canGenerate}
            onGenerate={onGenerate}
            showSubject={showSubject}
            onDelete={onDelete}
            canDelete={canDelete}
          />
        );
      })}
    </div>
  );
}
