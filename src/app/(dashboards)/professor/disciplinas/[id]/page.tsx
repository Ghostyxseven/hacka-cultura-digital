'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSubjectDetail } from '@/app/hooks';
import { LoadingSpinner, EmptyState, ActionButton } from '@/app/components';
import type { Unit } from '@/application/viewmodels';

/**
 * Página de detalhes da disciplina
 * 
 * Fluxo do Professor - Passo 3: Criação de Unidade/Aula
 * 
 * Lógica de negócio separada em hook customizado (Clean Architecture)
 */
export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.id as string;

  const { subject, units, loading, error, deleteSubject } = useSubjectDetail(subjectId);

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar esta disciplina?')) {
      return;
    }

    const success = await deleteSubject();
    if (success) {
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner message="Carregando disciplina..." />
        </div>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4 text-lg">{error || 'Disciplina não encontrada'}</p>
          <ActionButton href="/" variant="secondary">
            Voltar para Dashboard
          </ActionButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-8 py-8">
        <Link href="/" className="text-indigo-600 hover:text-indigo-700 mb-4 inline-block text-sm">
          ← Voltar para Dashboard
        </Link>

        {/* Subject Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{subject.name}</h1>
              {subject.description && (
                <p className="text-gray-600 text-lg mb-4">{subject.description}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {subject.schoolYears.map((year) => (
                  <span
                    key={year}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm font-medium"
                  >
                    {year}
                  </span>
                ))}
              </div>
            </div>
            <ActionButton onClick={handleDelete} variant="danger" icon="🗑️">
              Deletar
            </ActionButton>
          </div>
        </div>

        {/* Units Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Unidades de Ensino</h2>
            <p className="text-gray-600 text-sm mt-1">
              Crie unidades manualmente ou receba sugestões automáticas via IA
            </p>
          </div>
          <ActionButton href={`/professor/unidades/new?subjectId=${subjectId}`} icon="+">
            Nova Unidade
          </ActionButton>
        </div>

        {units.length === 0 ? (
          <EmptyState
            icon="📖"
            title="Nenhuma unidade cadastrada"
            description="Crie unidades de ensino para esta disciplina. Você pode criar manualmente ou receber sugestões automáticas via IA alinhadas à BNCC."
            actionLabel="Criar Primeira Unidade"
            actionHref={`/professor/unidades/new?subjectId=${subjectId}`}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {units.map((unit) => (
              <UnitCard key={unit.id} unit={unit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Card de unidade reutilizável
 * 
 * Exibe informações da unidade com botões de ação rápida
 * - Plano de aula
 * - Atividade
 * - Slides (futuro)
 */
function UnitCard({ unit }: { unit: Unit }) {
  const baseUrl = `/professor/unidades/${unit.id}/plano`;

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50/20 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-indigo-400 group relative overflow-hidden">
      {/* Gradiente de fundo sutil no hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors flex-1 leading-tight">
              {unit.title}
            </h3>
            {unit.isAIGenerated && (
              <span className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-lg text-xs font-semibold flex items-center whitespace-nowrap ml-3 shadow-sm border border-green-200">
                <span className="mr-1.5">✨</span>
                IA
              </span>
            )}
          </div>
          <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed">{unit.theme}</p>
        </div>

        {/* Status Badge */}
        <div className="mb-5 pb-5 border-b border-gray-200">
          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm ${
            unit.isAIGenerated 
              ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200' 
              : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300'
          }`}>
            {unit.isAIGenerated ? '✨ Sugerida pela IA' : '✏️ Criada Manualmente'}
          </span>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col gap-2.5">
          <Link
            href={baseUrl}
            className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <span className="mr-2 text-lg">📋</span>
            Plano de Aula
          </Link>
          <Link
            href={`${baseUrl}#atividade`}
            className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all text-sm font-semibold border-2 border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
          >
            <span className="mr-2 text-lg">📝</span>
            Atividade
          </Link>
          <button
            disabled
            className="flex items-center justify-center px-4 py-3 bg-gray-50 text-gray-400 rounded-xl text-sm font-medium border-2 border-gray-200 cursor-not-allowed opacity-60"
            title="Em breve"
          >
            <span className="mr-2 text-lg">🖼️</span>
            Slides (Em breve)
          </button>
        </div>
      </div>
    </div>
  );
}
