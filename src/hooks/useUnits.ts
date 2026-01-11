// src/hooks/useUnits.ts
import { useState, useEffect } from 'react';
import { getLessonPlanService } from '@/lib/service';
import { Unit } from '@/core/entities/Unit';

export function useUnits(subjectId?: string) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const service = getLessonPlanService();
      const allUnits = service.getUnits(subjectId);
      setUnits(allUnits);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar unidades');
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  const refresh = () => {
    setLoading(true);
    try {
      const service = getLessonPlanService();
      const allUnits = service.getUnits(subjectId);
      setUnits(allUnits);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar unidades');
    } finally {
      setLoading(false);
    }
  };

  return { units, loading, error, refresh };
}
