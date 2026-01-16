// src/hooks/useUnits.ts
import { useState, useEffect } from 'react';
import { getLessonPlanService } from '@/lib/service';
import { PresentationMapper } from '@/application';
import type { UnitViewModel } from '@/application/viewmodels';

/**
 * Hook customizado para gerenciar unidades na camada de apresentação
 * Usa ViewModels em vez de entidades do Core (seguindo Clean Architecture)
 */
export function useUnits(subjectId?: string) {
  const [units, setUnits] = useState<UnitViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const service = getLessonPlanService();
      const allUnitsEntities = service.getUnits(subjectId);
      const allUnits = PresentationMapper.toUnitViewModels(allUnitsEntities);
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
      const allUnitsEntities = service.getUnits(subjectId);
      const allUnits = PresentationMapper.toUnitViewModels(allUnitsEntities);
      setUnits(allUnits);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar unidades');
    } finally {
      setLoading(false);
    }
  };

  return { units, loading, error, refresh };
}
