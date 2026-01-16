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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header - Baseado no design de referência */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-3xl text-white">📖</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Cultura Digital</h1>
              <p className="text-gray-600 text-sm">Plataforma Educacional</p>
            </div>
          </div>
        </header>

        {/* Título e Descrição */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Painel do Professor</h2>
          <p className="text-gray-600">
            Crie aulas, provas e tarefas de Cultura Digital alinhadas à BNCC
          </p>
        </div>

        {/* Botões de Ação - Baseado no design de referência */}
        <div className="mb-8 flex flex-wrap gap-4">
          <ActionButton href="/professor/disciplinas/new" icon="➕">
            Criar conteúdo
          </ActionButton>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium shadow-sm"
          >
            <span className="mr-2">📄</span>
            Meus conteúdos
          </Link>
        </div>

        {/* Card de Seleção de Conteúdo - Baseado no design de referência */}
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

        {/* Estatísticas (opcional - pode ser removido se não estiver no design) */}
        {subjects.length > 0 && (
          <>
            <DashboardStats stats={stats} loading={loading} />

            {/* Grid de Disciplinas - "Meus conteúdos" */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Disciplinas Cadastradas</h3>
              <SubjectGrid
                subjects={subjectsWithStats.length > 0 ? subjectsWithStats : subjects}
                loading={loading}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
