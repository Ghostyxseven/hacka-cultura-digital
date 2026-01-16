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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
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
 */
function UnitCard({ unit }: { unit: Unit }) {
  return (
    <Link
      href={`/professor/unidades/${unit.id}/plano`}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors flex-1">
          {unit.title}
        </h3>
        <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity ml-2">→</span>
      </div>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{unit.theme}</p>
      <div className="flex items-center justify-between">
        {unit.isAIGenerated && (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium flex items-center">
            <span className="mr-1">✨</span>
            Sugerida por IA
          </span>
        )}
        <span className="text-gray-400 text-xs">Clique para ver materiais →</span>
      </div>
    </Link>
  );
}
