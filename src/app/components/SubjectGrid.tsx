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
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-12 text-center border border-gray-200">
        <div className="text-7xl mb-6 animate-bounce">📚</div>
        <p className="text-gray-800 mb-3 text-xl font-bold">Nenhuma disciplina cadastrada</p>
        <p className="text-gray-600 text-sm mb-8 max-w-md mx-auto leading-relaxed">
          Comece criando sua primeira disciplina para organizar seus materiais didáticos
        </p>
        <Link
          href="/professor/disciplinas/new"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
        >
          <span className="mr-2 text-xl">+</span>
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
          <div
            key={subject.id}
            className="bg-gradient-to-br from-white to-indigo-50/30 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] group border border-gray-200 hover:border-indigo-400 relative overflow-hidden"
          >
            {/* Gradiente de fundo sutil no hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300"></div>
            
            <div className="relative z-10">
              {/* Header com ícone e nome */}
              <div className="flex items-start justify-between mb-4">
                <Link 
                  href={`/professor/disciplinas/${subject.id}`}
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all transform group-hover:rotate-6">
                    <span className="text-2xl">📖</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                    {subject.name}
                  </h3>
                </Link>
                
                {/* Menu de ações */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/professor/disciplinas/${subject.id}`}
                    className="text-2xl text-gray-400 group-hover:text-indigo-600 transition-all transform group-hover:translate-x-1"
                  >
                    →
                  </Link>
                </div>
              </div>

              {/* Descrição */}
              <p className="text-gray-700 text-sm mb-5 line-clamp-2 min-h-[2.5rem] leading-relaxed">
                {subject.description || 'Sem descrição'}
              </p>

              {/* Estatísticas: Quantidade de unidades */}
              <div className="flex items-center gap-2 mb-5 text-sm">
                <div className="px-3 py-1.5 bg-indigo-100 rounded-lg border border-indigo-200">
                  <span className="font-bold text-indigo-700">{unitsCount}</span>
                  <span className="text-gray-600 ml-1">unidade{unitsCount !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Anos escolares */}
              <div className="flex flex-wrap gap-2 pt-5 border-t border-gray-200">
                {subject.schoolYears.map((year) => (
                  <span
                    key={year}
                    className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-200 shadow-sm group-hover:shadow-md transition-all"
                  >
                    {year}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
