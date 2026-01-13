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
    <div className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-purple-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Gradiente sutil no hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-pink-50/0 group-hover:from-purple-50/50 group-hover:to-pink-50/50 transition-all duration-300 pointer-events-none" />
      
      <div className="relative flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-4 mb-3">
            {/* Ícone do plano */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
              📖
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                {unit.topic}
              </h3>
              
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 font-semibold text-sm border border-gray-200 shadow-sm">
                  {unit.gradeYear}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-sm shadow-sm">
                  {unit.isSuggestedByAI ? (
                    <>
                      <span className="text-lg">🤖</span>
                      <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">Sugerida por IA</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg">✍️</span>
                      <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">Criada manualmente</span>
                    </>
                  )}
                </span>
              </div>
              
              {unit.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                  {unit.description}
                </p>
              )}
              
              {showSubject && subjectName && (
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                  <span className="font-semibold">Disciplina:</span>
                  <span className="px-2 py-1 rounded-md bg-gray-100 font-medium text-gray-700">{subjectName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 flex-shrink-0 items-start">
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
              className="text-sm whitespace-nowrap shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
            >
              🤖 Gerar Plano
            </Button>
          )}
          {unit.lessonPlanId && (
            <Link href={planHref}>
              <Button 
                variant="success" 
                className="text-sm whitespace-nowrap shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <span className="mr-2">📖</span>
                Ver Plano
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
