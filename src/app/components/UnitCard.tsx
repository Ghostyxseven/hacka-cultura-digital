// src/app/components/UnitCard.tsx
// Componente reutilizável para card de unidade
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { UnitViewModel } from '@/app/types';

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (showConfirm && onDelete) {
      setIsDeleting(true);
      onDelete(unit.id);
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
            <div>
              {!showConfirm ? (
                <button
                  onClick={handleDelete}
                  className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                  title="Excluir unidade"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              ) : (
                <div className="flex gap-1 opacity-100">
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
            <Link href={`/units/plan/${unit.id}`}>
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
