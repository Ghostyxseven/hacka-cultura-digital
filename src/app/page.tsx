'use client';

import { useDashboard } from './hooks';
import { DashboardStats, SubjectGrid, ActionButton } from './components';

/**
 * Dashboard Principal - Single User Application
 * Acesso direto sem autenticação
 * 
 * Fluxo do Professor - Passo 1: Acesso Inicial
 * 
 * Lógica de negócio separada em hook customizado (Clean Architecture)
 */
export default function Home() {
  const { subjects, loading } = useDashboard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Plataforma de Materiais Didáticos
          </h1>
          <p className="text-gray-600 text-lg">
            Geração automática de materiais didáticos de Cultura Digital alinhados à BNCC
          </p>
        </header>

        {/* Stats */}
        <DashboardStats subjects={subjects} loading={loading} />

        {/* Actions */}
        <div className="mb-8">
          <ActionButton href="/professor/disciplinas/new" icon="+">
            Nova Disciplina
          </ActionButton>
        </div>

        {/* Subjects Grid */}
        <SubjectGrid subjects={subjects} loading={loading} />
      </div>
    </div>
  );
}
