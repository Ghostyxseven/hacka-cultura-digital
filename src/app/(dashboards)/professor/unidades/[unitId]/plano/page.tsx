'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useMaterialGeneration, useToast } from '@/app/hooks';
import {
  LoadingSpinner,
  GenerationForm,
  LessonPlanView,
  ActivityView,
  SlideView,
  Tabs,
  ExportButton,
  ActionButton,
  ToastContainer,
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
    slides,
    loading,
    generating,
    generatingSlides,
    error,
    loadMaterials,
    generateMaterials,
    generateSlides,
    archiveAllMaterials,
  } = useMaterialGeneration(unitId);
  const { toasts, showToast, removeToast } = useToast();

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
      showToast('Materiais gerados com sucesso!', 'success');
      setShowForm(false);
      setActiveTab('plano'); // Volta para aba de plano após gerar
    } catch (err: any) {
      showToast(err.message || 'Erro ao gerar materiais', 'error');
    }
  };

  const handleRegenerate = () => {
    setShowForm(true);
  };

  const handleGenerateSlides = async () => {
    if (!lessonPlan) {
      showToast('Gere o plano de aula primeiro antes de gerar slides', 'warning');
      setActiveTab('plano');
      return;
    }

    try {
      await generateSlides({
        unitId,
      });
      showToast('Slides gerados com sucesso!', 'success');
      setActiveTab('slides');
    } catch (err: any) {
      showToast(err.message || 'Erro ao gerar slides', 'error');
    }
  };

  const handleArchive = async () => {
    if (!confirm('Tem certeza que deseja arquivar todos os materiais desta unidade?')) {
      return;
    }

    try {
      const success = await archiveAllMaterials();
      if (success) {
        showToast('Materiais arquivados com sucesso!', 'success');
        setShowForm(true);
      } else {
        showToast(error || 'Erro ao arquivar materiais', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Erro ao arquivar materiais', 'error');
    }
  };

  const handleExportPDF = () => {
    // Exportação para PDF usando window.print com estilos otimizados
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Por favor, permita pop-ups para exportar o PDF', 'warning');
      return;
    }

    const printContent = document.querySelector('.export-content');
    if (!printContent) {
      showToast('Conteúdo não encontrado para exportação', 'error');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Materiais Didáticos - ${lessonPlan?.title || 'Plano de Aula'}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              padding: 40px;
              background: white;
            }
            h1 { color: #1e3a8a; margin-bottom: 10px; font-size: 28px; }
            h2 { color: #1e40af; margin-top: 30px; margin-bottom: 15px; font-size: 22px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; }
            h3 { color: #2563eb; margin-top: 20px; margin-bottom: 10px; font-size: 18px; }
            p { margin-bottom: 12px; text-align: justify; }
            ul { margin-left: 20px; margin-bottom: 15px; }
            li { margin-bottom: 8px; }
            .section { margin-bottom: 30px; page-break-inside: avoid; }
            .badge { 
              display: inline-block; 
              padding: 4px 8px; 
              background: #e0e7ff; 
              color: #3730a3; 
              border-radius: 4px; 
              font-size: 12px;
              margin: 5px 5px 5px 0;
            }
            .question-card { 
              background: #f9fafb; 
              border-left: 4px solid #6366f1; 
              padding: 15px; 
              margin: 15px 0;
              border-radius: 4px;
            }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
              .section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      // Opcional: fechar após impressão
      // printWindow.close();
    }, 250);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-8 py-8">
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
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="min-h-screen bg-gray-50">
        <div className="px-8 py-8">
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-900 mb-6 inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <span>←</span>
          <span>Voltar para Dashboard</span>
        </Link>

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
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Materiais Didáticos</h1>
                  <p className="text-gray-600">Plano de aula, atividades e recursos para esta unidade</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <ActionButton
                    onClick={handleRegenerate}
                    icon="✏️"
                    variant="secondary"
                    className="shadow-md hover:shadow-lg transition-shadow"
                  >
                    Editar/Regenerar
                  </ActionButton>
                  <ActionButton
                    onClick={handleArchive}
                    icon="📦"
                    variant="secondary"
                    className="shadow-md hover:shadow-lg transition-shadow bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
                  >
                    Arquivar Materiais
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
                <div id="slides">
                  {generatingSlides ? (
                    <LoadingSpinner message="Gerando slides..." size="lg" />
                  ) : slides && slides.length > 0 ? (
                    <SlideView slides={slides} onRegenerate={handleGenerateSlides} />
                  ) : (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
                      <div className="text-6xl mb-6">🖼️</div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">Slides de Apresentação</h2>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                        {lessonPlan 
                          ? 'Clique no botão abaixo para gerar slides automaticamente a partir do plano de aula.'
                          : 'Gere o plano de aula primeiro para poder criar os slides.'}
                      </p>
                      {lessonPlan && (
                        <button
                          onClick={handleGenerateSlides}
                          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                          aria-label="Gerar slides"
                        >
                          🖼️ Gerar Slides
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
      </div>
    </>
  );
}
