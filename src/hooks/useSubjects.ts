// src/hooks/useSubjects.ts
import { useState, useEffect } from 'react';
import { getLessonPlanService } from '@/lib/service';
import type { SubjectViewModel } from '@/app/types';

/**
 * Hook customizado para gerenciar disciplinas na camada de apresentação
 * Usa ViewModels em vez de entidades do Core (seguindo Clean Architecture)
 */
export function useSubjects() {
  const [subjects, setSubjects] = useState<SubjectViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const service = getLessonPlanService();
      const allSubjects = service.getSubjectsViewModels();
      setSubjects(allSubjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar disciplinas');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = () => {
    setLoading(true);
    try {
      const service = getLessonPlanService();
      const allSubjects = service.getSubjectsViewModels();
      setSubjects(allSubjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar disciplinas');
    } finally {
      setLoading(false);
    }
  };

  return { subjects, loading, error, refresh };
}
