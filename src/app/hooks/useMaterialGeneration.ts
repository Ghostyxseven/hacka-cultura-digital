import { useState, useCallback } from 'react';
import { ApplicationServiceFactory } from '@/application';
import type { LessonPlan, Activity } from '@/application/viewmodels';

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
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
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

      const { LocalStorageLessonPlanRepository } = await import('@/repository/implementations/LocalStorageLessonPlanRepository');
      const planRepository = new LocalStorageLessonPlanRepository();
      
      await planRepository.update(lessonPlan.id, {
        archived: true,
        archivedAt: new Date().toISOString(),
      });
      
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

      const { LocalStorageActivityRepository } = await import('@/repository/implementations/LocalStorageActivityRepository');
      const activityRepository = new LocalStorageActivityRepository();
      
      await activityRepository.update(activity.id, {
        archived: true,
        archivedAt: new Date().toISOString(),
      });
      
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

  return {
    lessonPlan,
    activity,
    loading,
    generating,
    error,
    loadMaterials,
    generateMaterials,
    archiveLessonPlan,
    archiveActivity,
    archiveAllMaterials,
  };
}
