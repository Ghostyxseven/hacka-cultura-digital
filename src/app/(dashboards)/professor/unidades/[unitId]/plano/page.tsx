'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useMaterialGeneration } from '@/app/hooks';
import {
  LoadingSpinner,
  GenerationForm,
  LessonPlanView,
  ActivityView,
  Tabs,
  ExportButton,
  ActionButton,
} from '@/app/components';

type TabType = 'plano' | 'atividade' | 'slides';

/**
 * Página de Unidade/Aula
 * 
 * 📝 Tela de Unidade/Aula com estrutura em abas
 * 
 * Características:
 * - Abas: Plano de aula, Atividade avaliativa, Slides (opcional)
 * - Botão de edição/regeneração
 * - Exportar/Salvar em PDF
 * 
 * Fluxo do Professor - Passo 4: Geração de Materiais Didáticos
 * 
 * Lógica de negócio separada em hook customizado (Clean Architecture)
 */
export default function GenerateLessonPlanPage() {
  const params = useParams();
  const unitId = params.unitId as string;

  const [activeTab, setActiveTab] = useState<TabType>('plano');
  const [showForm, setShowForm] = useState(false);

  const {
    lessonPlan,
    activity,
    loading,
    generating,
    error,
    loadMaterials,
    generateMaterials,
  } = useMaterialGeneration(unitId);

  useEffect(() => {
    loadMaterials().then((result) => {
      if (!result) {
        setShowForm(true);
      }
    });
  }, [unitId, loadMaterials]);

  // Detectar hash na URL para abrir aba específica
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'atividade') {
        setActiveTab('atividade');
      }
    }
  }, []);

  const handleGenerate = async (data: { year?: string; additionalContext?: string }) => {
    try {
      await generateMaterials({
        unitId,
        year: data.year,
        additionalContext: data.additionalContext,
      });
      setShowForm(false);
      setActiveTab('plano'); // Volta para aba de plano após gerar
    } catch (err) {
      // Erro já está sendo tratado no hook
    }
  };

  const handleRegenerate = () => {
    setShowForm(true);
  };

  const handleExportPDF = () => {
    // TODO: Implementar exportação para PDF
    alert('Funcionalidade de exportação em PDF será implementada em breve!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner message="Carregando materiais..." />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'plano', label: 'Plano de Aula', icon: '📋' },
    { id: 'atividade', label: 'Atividade Avaliativa', icon: '📝' },
    { id: 'slides', label: 'Slides', icon: '🖼️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-indigo-600 hover:text-indigo-700 mb-4 inline-block text-sm">
          ← Voltar para Dashboard
        </Link>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* Formulário de geração */}
        {showForm && !lessonPlan && (
          <GenerationForm onSubmit={handleGenerate} loading={generating} />
        )}

        {/* Estado de geração */}
        {generating && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center max-w-2xl mx-auto">
            <LoadingSpinner
              message="Gerando materiais didáticos com IA... Isso pode levar alguns segundos."
              size="lg"
            />
          </div>
        )}

        {/* Materiais gerados com abas */}
        {lessonPlan && activity && !generating && !showForm && (
          <div className="export-content">
            {/* Header com botões de ação */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Materiais Didáticos</h1>
                  <p className="text-gray-600">Plano de aula, atividades e recursos para esta unidade</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <ActionButton
                    onClick={handleRegenerate}
                    icon="✏️"
                    variant="secondary"
                  >
                    Editar/Regenerar
                  </ActionButton>
                  <ExportButton onExport={handleExportPDF} />
                </div>
              </div>
            </div>

            {/* Abas */}
            <Tabs activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as TabType)} tabs={tabs} />

            {/* Conteúdo das abas */}
            <div className="mt-6">
              {activeTab === 'plano' && (
                <div id="plano">
                  <LessonPlanView plan={lessonPlan} onRegenerate={handleRegenerate} />
                </div>
              )}

              {activeTab === 'atividade' && (
                <div id="atividade">
                  <ActivityView activity={activity} />
                </div>
              )}

              {activeTab === 'slides' && (
                <div id="slides" className="bg-white rounded-lg shadow-md p-12 text-center">
                  <div className="text-6xl mb-4">🖼️</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Slides de Apresentação</h2>
                  <p className="text-gray-600 mb-4">
                    Funcionalidade de geração de slides será implementada em breve.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Os slides serão gerados automaticamente a partir do plano de aula.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Feedback de sucesso */}
        {lessonPlan && activity && !generating && !showForm && (
          <div className="mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            ✅ Plano de aula e atividade gerados com sucesso! Use as abas acima para navegar.
          </div>
        )}
      </div>
    </div>
  );
}
