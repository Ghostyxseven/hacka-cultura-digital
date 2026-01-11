// src/hooks/useSubjects.ts
import { useState, useEffect } from 'react';
import { getLessonPlanService } from '@/lib/service';
import { Subject } from '@/core/entities/Subject';

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const service = getLessonPlanService();
      const allSubjects = service.getSubjects();
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
      const allSubjects = service.getSubjects();
      setSubjects(allSubjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar disciplinas');
    } finally {
      setLoading(false);
    }
  };

  return { subjects, loading, error, refresh };
}
