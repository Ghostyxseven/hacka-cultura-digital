import { useState, useCallback } from 'react';
import { ApplicationServiceFactory } from '@/application';
import type { LessonPlan, Activity, Slide } from '@/application/viewmodels';
import { getErrorMessage } from '@/app/utils/errorHandler';

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
  const [defaultYear, setDefaultYear] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingSlides, setGeneratingSlides] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMaterials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const materialService = ApplicationServiceFactory.createMaterialGenerationService();

      // Busca a unidade para pegar o ano escolar da disciplina
      try {
        // Usa o MaterialGenerationService para buscar a unidade através do repositório
        const materialService = ApplicationServiceFactory.createMaterialGenerationService();
        
        // Busca o plano de aula para ter acesso ao unitId, ou tenta buscar direto a unidade
        // Como alternativa, vamos buscar através do getLessonPlanByUnit que já busca a unidade
        // Mas na verdade, precisamos acessar o repositório diretamente aqui
        
        // Solução: buscar via ApplicationServiceFactory usando o repositório
        const { LocalStorageUnitRepository } = await import('@/repository/implementations');
        const { LocalStorageSubjectRepository } = await import('@/repository/implementations');
        
        const unitRepo = new LocalStorageUnitRepository();
        const subjectRepo = new LocalStorageSubjectRepository();
        
        const unit = await unitRepo.findById(unitId);
        
        if (unit) {
          // Busca a disciplina para pegar o ano escolar
          const subject = await subjectRepo.findById(unit.subjectId);
          if (subject && subject.schoolYears && subject.schoolYears.length > 0) {
            // Pega o primeiro ano escolar (agora é seleção única)
            setDefaultYear(subject.schoolYears[0]);
          }
        }
      } catch (err) {
        // Se não conseguir buscar, continua sem o ano padrão
        console.warn('Erro ao buscar ano escolar da disciplina:', err);
      }

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
      setError(getErrorMessage(err));
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
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
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
      setError(getErrorMessage(err));
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
      setError(getErrorMessage(err));
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
      setError(getErrorMessage(err));
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
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setGeneratingSlides(false);
    }
  }, [lessonPlan]);

  return {
    lessonPlan,
    activity,
    slides,
    defaultYear,
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
