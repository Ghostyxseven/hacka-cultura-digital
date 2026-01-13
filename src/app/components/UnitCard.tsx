// src/app/components/UnitCard.tsx
// Componente reutilizável para card de unidade
'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button, ConfirmDeleteButton } from '@/components';
import type { UnitViewModel } from '@/application/viewmodels';

interface UnitCardProps {
  unit: UnitViewModel;
  subjectName?: string;
  canGenerate?: boolean;
  onGenerate?: (unitId: string) => void;
  showSubject?: boolean;
  onDelete?: (id: string) => void;
  canDelete?: boolean;
}

export function UnitCard({ 
  unit, 
  subjectName, 
  canGenerate = false, 
  onGenerate,
  showSubject = false,
  onDelete,
  canDelete = false
}: UnitCardProps) {
  const { isProfessor, isAdmin } = useAuth();
  const isAluno = !isProfessor && !isAdmin;
  
  // Define a rota baseada no tipo de usuário
  const planHref = isAluno 
    ? `/aluno/unidades/${unit.id}/plano` 
    : `/professor/unidades/${unit.id}/plano`;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(unit.id);
    }
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-primary-300 transition-all duration-200">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {unit.topic}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 font-medium">
              {unit.gradeYear}
            </span>
            <span className="inline-flex items-center gap-1">
              {unit.isSuggestedByAI ? (
                <>
                  <span className="text-purple-500">🤖</span>
                  <span className="text-purple-600 font-medium">Sugerida por IA</span>
                </>
              ) : (
                <>
                  <span className="text-blue-500">✍️</span>
                  <span className="text-blue-600 font-medium">Criada manualmente</span>
                </>
              )}
            </span>
          </div>
          {unit.description && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {unit.description}
            </p>
          )}
          {showSubject && subjectName && (
            <p className="text-xs text-gray-400 mt-2">
              Disciplina: <span className="font-medium text-gray-600">{subjectName}</span>
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {canDelete && onDelete && (
            <div onClick={(e) => e.stopPropagation()}>
              <ConfirmDeleteButton
                onConfirm={handleDelete}
                itemName={unit.topic}
              />
            </div>
          )}
          {!unit.lessonPlanId && canGenerate && onGenerate && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onGenerate(unit.id);
              }}
              className="text-sm whitespace-nowrap"
            >
              Gerar Plano
            </Button>
          )}
          {unit.lessonPlanId && (
            <Link href={planHref}>
              <Button variant="success" className="text-sm whitespace-nowrap">
                Ver Plano
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
