'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Página inicial - Redireciona para o dashboard do professor
 * Mantém consistência com layout de sidebar em todas as páginas
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona automaticamente para o dashboard do professor (com sidebar)
    router.replace('/professor');
  }, [router]);

  // Mostra loading enquanto redireciona
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando dashboard...</p>
      </div>
    </div>
  );
}
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
            href="/professor/disciplinas"
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

        {/* Seção de Arquivos Arquivados */}
        {(archivedStats.archivedUnits > 0 || archivedStats.archivedPlans > 0 || archivedStats.archivedActivities > 0) && (
          <div className="mt-12 pt-8 border-t border-gray-300">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>📦</span>
                Conteúdos Arquivados
              </h3>
              <p className="text-gray-600">
                Materiais arquivados que podem ser restaurados a qualquer momento
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 border-2 border-gray-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">📖</span>
                  <span className="text-2xl font-bold text-gray-700">{archivedStats.archivedUnits}</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">Unidades Arquivadas</h4>
                <p className="text-sm text-gray-600">Aulas que foram arquivadas</p>
              </div>
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 border-2 border-gray-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">📋</span>
                  <span className="text-2xl font-bold text-gray-700">{archivedStats.archivedPlans}</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">Planos Arquivados</h4>
                <p className="text-sm text-gray-600">Planos de aula arquivados</p>
              </div>
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 border-2 border-gray-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">📝</span>
                  <span className="text-2xl font-bold text-gray-700">{archivedStats.archivedActivities}</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">Atividades Arquivadas</h4>
                <p className="text-sm text-gray-600">Atividades avaliativas arquivadas</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500 italic">
              💡 Dica: Os materiais arquivados são removidos da visualização ativa, mas permanecem salvos para uso futuro.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
