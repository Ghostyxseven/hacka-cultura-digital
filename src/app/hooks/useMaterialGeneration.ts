import { useState, useCallback } from 'react';
import { ApplicationServiceFactory } from '@/application';
import type { LessonPlan, Activity, Slide } from '@/application/viewmodels';

export interface GenerateMaterialParams {
  unitId: string;
  year?: string;
  additionalContext?: string;
}

/**
 * Hook customizado para lógica de geração de materiais didáticos
 * Separa lógica de negócio da apresentação
 */
export function useMaterialGeneration(unitId: string) {
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [slides, setSlides] = useState<Slide[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingSlides, setGeneratingSlides] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMaterials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const materialService = ApplicationServiceFactory.createMaterialGenerationService();

      try {
        const [plan, act] = await Promise.all([
          materialService.getLessonPlanByUnit(unitId),
          materialService.getActivityByUnit(unitId),
        ]);
        setLessonPlan(plan);
        setActivity(act);
        return { plan, act };
      } catch {
        // Materiais não existem ainda
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar materiais');
      return null;
    } finally {
      setLoading(false);
    }
  }, [unitId]);

  const generateMaterials = useCallback(async (params: GenerateMaterialParams) => {
    try {
      setGenerating(true);
      setError(null);

      const materialService = ApplicationServiceFactory.createMaterialGenerationService();
      const result = await materialService.generateAllMaterials({
        unitId: params.unitId,
        year: params.year,
        additionalContext: params.additionalContext,
      });

      setLessonPlan(result.lessonPlan);
      setActivity(result.activity);
      return result;
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar materiais');
      throw err;
    } finally {
      setGenerating(false);
    }
  }, []);

  const archiveLessonPlan = useCallback(async () => {
    try {
      if (!lessonPlan) return false;

      const materialService = ApplicationServiceFactory.createMaterialGenerationService();
      await materialService.archiveLessonPlan(lessonPlan.id);
      
      setLessonPlan(null);
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao arquivar plano de aula');
      return false;
    }
  }, [lessonPlan]);

  const archiveActivity = useCallback(async () => {
    try {
      if (!activity) return false;

      const materialService = ApplicationServiceFactory.createMaterialGenerationService();
      await materialService.archiveActivity(activity.id);
      
      setActivity(null);
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao arquivar atividade');
      return false;
    }
  }, [activity]);

  const archiveAllMaterials = useCallback(async () => {
    try {
      const results = await Promise.all([
        archiveLessonPlan(),
        archiveActivity(),
      ]);
      
      return results.every(r => r === true);
    } catch (err: any) {
      setError(err.message || 'Erro ao arquivar materiais');
      return false;
    }
  }, [archiveLessonPlan, archiveActivity]);

  const generateSlides = useCallback(async (params: GenerateMaterialParams) => {
    try {
      setGeneratingSlides(true);
      setError(null);

      // Verifica se o plano de aula existe (necessário para gerar slides)
      if (!lessonPlan) {
        throw new Error('Gere o plano de aula primeiro antes de gerar slides');
      }

      const materialService = ApplicationServiceFactory.createMaterialGenerationService();
      const generatedSlides = await materialService.generateSlides(
        params.unitId,
        params.year,
        params.additionalContext
      );

      setSlides(generatedSlides);
      return generatedSlides;
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar slides');
      throw err;
    } finally {
      setGeneratingSlides(false);
    }
  }, [lessonPlan]);

  return {
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
    archiveLessonPlan,
    archiveActivity,
    archiveAllMaterials,
  };
}
