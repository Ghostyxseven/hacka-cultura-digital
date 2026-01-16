'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useMaterialGeneration } from '@/app/hooks';
import { LoadingSpinner, GenerationForm, LessonPlanView, ActivityView } from '@/app/components';

/**
 * Página de geração de plano de aula
 * 
 * Fluxo do Professor - Passo 4: Geração de Materiais Didáticos
 * 
 * Lógica de negócio separada em hook customizado (Clean Architecture)
 */
export default function GenerateLessonPlanPage() {
  const params = useParams();
  const unitId = params.unitId as string;

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    year: '',
    additionalContext: '',
  });

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

  const handleGenerate = async (data: { year?: string; additionalContext?: string }) => {
    try {
      await generateMaterials({
        unitId,
        year: data.year,
        additionalContext: data.additionalContext,
      });
      setShowForm(false);
    } catch (err) {
      // Erro já está sendo tratado no hook
    }
  };

  const handleRegenerate = () => {
    setShowForm(true);
    setFormData({
      year: '',
      additionalContext: '',
    });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-indigo-600 hover:text-indigo-700 mb-4 inline-block text-sm">
          ← Voltar para Dashboard
        </Link>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
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

        {/* Materiais gerados */}
        {lessonPlan && activity && !generating && (
          <div className="space-y-6">
            <LessonPlanView plan={lessonPlan} onRegenerate={handleRegenerate} />
            <ActivityView activity={activity} />
          </div>
        )}
      </div>
    </div>
  );
}
