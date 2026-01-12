// src/app/pages/components/UnitCard.tsx
// Componente reutilizável para card de unidade
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import type { UnitViewModel } from '@/app/types';

interface UnitCardProps {
  unit: UnitViewModel;
  subjectName?: string;
  canGenerate?: boolean;
  onGenerate?: (unitId: string) => void;
  showSubject?: boolean;
}

export function UnitCard({ 
  unit, 
  subjectName, 
  canGenerate = false, 
  onGenerate,
  showSubject = false 
}: UnitCardProps) {
  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{unit.topic}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {unit.gradeYear} • {unit.isSuggestedByAI ? '🤖 Sugerida por IA' : '✍️ Criada manualmente'}
          </p>
          {unit.description && (
            <p className="text-sm text-gray-500 mt-2">{unit.description}</p>
          )}
          {showSubject && subjectName && (
            <p className="text-sm text-gray-500 mt-1">Disciplina: {subjectName}</p>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          {!unit.lessonPlanId && canGenerate && onGenerate && (
            <Button
              onClick={() => onGenerate(unit.id)}
              className="text-sm"
            >
              Gerar Plano
            </Button>
          )}
          {unit.lessonPlanId && (
            <Link href={`/units/plan/${unit.id}`}>
              <Button variant="success" className="text-sm">
                Ver Plano
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
