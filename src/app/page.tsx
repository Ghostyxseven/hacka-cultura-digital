'use client';

import Link from 'next/link';
import { useDashboard } from './hooks';
import { DashboardStats, SubjectGrid, ActionButton, LoadingSpinner } from './components';

/**
 * Dashboard Principal - Single User Application
 * Acesso direto sem autenticação
 * 
 * 🏠 Tela Inicial (Dashboard)
 * 
 * Características:
 * - Visão geral simples e limpa
 * - Cards visuais para disciplinas com estatísticas
 * - Botões de ação rápida
 * - Feedback visual em tempo real
 * 
 * Fluxo do Professor - Passo 1: Acesso Inicial
 * 
 * Lógica de negócio separada em hook customizado (Clean Architecture)
 */
export default function Home() {
  const { subjects, subjectsWithStats, loading, error, stats } = useDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner message="Carregando dashboard..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-5xl">🎓</span>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Materiais Didáticos
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Geração automática de materiais de Cultura Digital alinhados à BNCC
              </p>
            </div>
          </div>
        </header>

        {/* Estatísticas */}
        <DashboardStats stats={stats} loading={loading} />

        {/* Botões de Ação Rápida */}
        <div className="mb-8 flex flex-wrap gap-4">
          <ActionButton href="/professor/disciplinas/new" icon="➕">
            Nova Disciplina
          </ActionButton>
          {subjects.length > 0 && (
            <Link
              href={`/professor/disciplinas/${subjects[0].id}`}
              className="inline-flex items-center px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors shadow-md font-medium"
            >
              <span className="mr-2">🔍</span>
              Explorar Sugestões via IA
            </Link>
          )}
        </div>

        {/* Mensagens de Feedback */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        {/* Grid de Disciplinas */}
        <SubjectGrid subjects={subjectsWithStats.length > 0 ? subjectsWithStats : subjects} loading={loading} />
      </div>
    </div>
  );
}
