'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDashboard } from './hooks';
import {
  DashboardStats,
  SubjectGrid,
  ActionButton,
  LoadingSpinner,
  ContentSelectionCard,
} from './components';

/**
 * Dashboard Principal - Single User Application
 * Acesso direto sem autenticação
 * 
 * 🏠 Tela Inicial (Dashboard) - Baseado no design de referência
 * 
 * Características do design:
 * - Header com ícone azul (livro) + "Cultura Digital" + "Plataforma Educacional"
 * - Título "Painel do Professor"
 * - Botões: "Criar conteúdo" e "Meus conteúdos"
 * - Card de seleção com dropdowns (Ano, Disciplina, Assunto)
 * 
 * Fluxo do Professor - Passo 1: Acesso Inicial
 * 
 * Lógica de negócio separada em hook customizado (Clean Architecture)
 */
export default function Home() {
  const router = useRouter();
  const { subjects, subjectsWithStats, loading, error, stats } = useDashboard();

  const handleGenerateContent = (data: { year: string; subjectId: string; topic: string }) => {
    // Navega para criar unidade com os dados preenchidos
    router.push(
      `/professor/unidades/new?subjectId=${data.subjectId}&year=${encodeURIComponent(data.year)}&topic=${encodeURIComponent(data.topic)}`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner message="Carregando dashboard..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-8 py-8">
        {/* Saudação e Calendário - Design moderno */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 flex items-center gap-4">
            <span className="text-4xl">👋</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Olá, Professor!</h1>
              <p className="text-gray-600">Hoje é um ótimo dia para ensinar.</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm px-4 py-3 border border-gray-200 flex items-center gap-2">
            <span className="text-xl">📅</span>
            <span className="text-sm text-gray-700 font-medium">
              {new Date().toLocaleDateString('pt-BR', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
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
            className="bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">✨</span>
              <span className="text-2xl opacity-80">✨</span>
            </div>
            <h3 className="font-bold text-lg mb-1">Criar Aula com IA</h3>
            <p className="text-sm text-teal-100">Gere conteúdo automaticamente</p>
          </Link>

          <Link
            href="/professor/disciplinas"
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] border border-gray-200 group"
          >
            <span className="text-3xl mb-3 block">📝</span>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Meus Planos</h3>
            <p className="text-sm text-gray-600">Visualize seus planos</p>
          </Link>

          <Link
            href="/#meus-conteudos"
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] border border-gray-200 group"
          >
            <span className="text-3xl mb-3 block">📁</span>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Meus Conteúdos</h3>
            <p className="text-sm text-gray-600">Gerencie disciplinas</p>
          </Link>

          <button
            disabled
            className="bg-white rounded-xl p-6 shadow-md border border-gray-200 opacity-60 cursor-not-allowed"
          >
            <span className="text-3xl mb-3 block">✅</span>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Corrigir</h3>
            <p className="text-sm text-gray-600">Em breve</p>
          </button>
        </div>

        {/* Card de Seleção de Conteúdo - Geração Rápida */}
        <div className="mb-8">
          <ContentSelectionCard
            subjects={subjects.map((s) => ({ id: s.id, name: s.name }))}
            onGenerate={handleGenerateContent}
          />
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
      </div>
    </div>
  );
}
