'use client';

import Link from 'next/link';
import type { Subject } from '@/application/viewmodels';

interface SubjectWithUnits extends Subject {
  unitsCount?: number;
}

interface SubjectGridProps {
  subjects: Subject[] | SubjectWithUnits[];
  loading?: boolean;
}

/**
 * Componente de grid de disciplinas
 * Exibe disciplinas em formato de cards clicáveis com estatísticas
 * 
 * Características:
 * - Cards visuais limpos e organizados
 * - Quantidade de unidades/aulas por disciplina
 * - Anos escolares em badges
 * - Hover effects para melhor interação
 */
export function SubjectGrid({ subjects, loading }: SubjectGridProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600">Carregando disciplinas...</p>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-6xl mb-4">📚</div>
        <p className="text-gray-600 mb-4 text-lg">Nenhuma disciplina cadastrada</p>
        <p className="text-gray-500 text-sm mb-6">
          Comece criando sua primeira disciplina para organizar seus materiais didáticos
        </p>
        <Link
          href="/professor/disciplinas/new"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
        >
          <span className="mr-2">+</span>
          Criar Primeira Disciplina
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subjects.map((subject) => {
        const subjectWithUnits = subject as SubjectWithUnits;
        const unitsCount = subjectWithUnits.unitsCount ?? 0;
        
        return (
          <Link
            key={subject.id}
            href={`/professor/disciplinas/${subject.id}`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer group border border-gray-100 hover:border-indigo-300"
          >
            {/* Header com ícone e nome */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-3xl">📖</span>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                  {subject.name}
                </h3>
              </div>
              <span className="text-2xl text-gray-400 group-hover:text-indigo-600 transition-colors">
                →
              </span>
            </div>

            {/* Descrição */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
              {subject.description || 'Sem descrição'}
            </p>

            {/* Estatísticas: Quantidade de unidades */}
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
              <span className="font-medium text-indigo-600">{unitsCount}</span>
              <span>unidade{unitsCount !== 1 ? 's' : ''} cadastrada{unitsCount !== 1 ? 's' : ''}</span>
            </div>

            {/* Anos escolares */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
              {subject.schoolYears.map((year) => (
                <span
                  key={year}
                  className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium border border-indigo-100"
                >
                  {year}
                </span>
              ))}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
