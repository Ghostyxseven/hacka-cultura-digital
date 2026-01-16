'use client';

import Link from 'next/link';
import { useDashboard } from '@/app/hooks';
import {
  DashboardStats,
  SubjectGrid,
  ActionButton,
  LoadingSpinner,
} from '@/app/components';

/**
 * Dashboard Principal - Single User Application
 * Com sidebar de navegação (layout aplicado pelo ProfessorLayout)
 * 
 * 🏠 Tela Inicial (Dashboard) - Baseado no design de referência
 * 
 * Características do design:
 * - Sidebar lateral com navegação
 * - Saudação e calendário
 * - Estatísticas em cards
 * - Botões de ação principais
 * - Card de seleção de conteúdo
 * - Grid de disciplinas
 * 
 * Fluxo do Professor - Passo 1: Acesso Inicial
 * 
 * Lógica de negócio separada em hook customizado (Clean Architecture)
 */
export default function ProfessorDashboard() {
  const { subjects, subjectsWithStats, loading, error, stats, archivedStats } = useDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Carregando dashboard..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-8 py-8">
        {/* Saudação e Calendário - Design moderno */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 flex items-center gap-4">
            <span className="text-5xl">👋</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Olá, Professor!</h1>
              <p className="text-gray-600">Hoje é um ótimo dia para ensinar.</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm px-5 py-3 border border-gray-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center border border-red-100">
              <span className="text-red-600 font-bold text-lg">{new Date().getDate()}</span>
            </div>
            <div>
              <span className="text-sm text-gray-700 font-medium block">
                {new Date().toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Estatísticas - Cards visuais */}
        <div className="mb-8">
          <DashboardStats stats={stats} loading={loading} />
        </div>

        {/* Botões de Ação Principais */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/professor/disciplinas/new"
            className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">✨</span>
              <span className="text-3xl opacity-70">✨</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Criar Aula com IA</h3>
            <p className="text-sm text-teal-50">Gere conteúdo automaticamente</p>
          </Link>

          <Link
            href="/#meus-conteudos"
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] border border-gray-200 group"
          >
            <span className="text-4xl mb-4 block">📝</span>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Meus Planos</h3>
            <p className="text-sm text-gray-600">Visualize seus planos</p>
          </Link>

          <Link
            href="/#meus-conteudos"
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] border border-gray-200 group"
          >
            <span className="text-4xl mb-4 block">📁</span>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Meus Conteúdos</h3>
            <p className="text-sm text-gray-600">Gerencie disciplinas</p>
          </Link>

          <button
            disabled
            className="bg-white rounded-xl p-6 shadow-md border border-gray-200 opacity-60 cursor-not-allowed"
          >
            <span className="text-4xl mb-4 block">✅</span>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Corrigir</h3>
            <p className="text-sm text-gray-600">Em breve</p>
          </button>
        </div>

        {/* Mensagens de Feedback */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        {/* Grid de Disciplinas - "Meus conteúdos" */}
        {subjects.length > 0 && (
          <div id="meus-conteudos" className="mt-8 scroll-mt-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Disciplinas Cadastradas</h3>
              <p className="text-gray-600">
                Gerencie suas disciplinas e unidades de ensino criadas
              </p>
            </div>
            <SubjectGrid
              subjects={subjectsWithStats.length > 0 ? subjectsWithStats : subjects}
              loading={loading}
            />
          </div>
        )}

        {/* Link para Arquivos Arquivados */}
        {(archivedStats.archivedUnits > 0 || archivedStats.archivedPlans > 0 || archivedStats.archivedActivities > 0) && (
          <div className="mt-8">
            <Link
              href="/professor/arquivados"
              className="block bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 border-2 border-gray-300 hover:border-indigo-400 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Ver Conteúdos Arquivados
                    </h3>
                    <p className="text-sm text-gray-600">
                      {archivedStats.archivedUnits + archivedStats.archivedPlans + archivedStats.archivedActivities} item(s) arquivado(s)
                    </p>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-indigo-600 transition-colors">→</span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
