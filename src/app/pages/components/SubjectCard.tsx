// src/app/pages/components/SubjectCard.tsx
// Componente reutilizável para card de disciplina
import Link from 'next/link';
import type { SubjectViewModel } from '@/app/types';

interface SubjectCardProps {
  subject: SubjectViewModel;
  unitCount?: number;
  showUnitCount?: boolean;
}

export function SubjectCard({ subject, unitCount, showUnitCount = false }: SubjectCardProps) {
  return (
    <Link
      href={`/subjects/${subject.id}`}
      className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
    >
      <h3 className="font-semibold text-gray-900 mb-2">{subject.name}</h3>
      {subject.description && (
        <p className="text-sm text-gray-600 mb-2">{subject.description}</p>
      )}
      {showUnitCount && unitCount !== undefined && (
        <p className="text-xs text-gray-500">
          {unitCount} {unitCount === 1 ? 'unidade' : 'unidades'}
        </p>
      )}
    </Link>
  );
}
