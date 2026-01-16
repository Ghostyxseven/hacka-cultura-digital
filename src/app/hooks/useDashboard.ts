import { useState, useEffect, useCallback } from 'react';
import { ApplicationServiceFactory } from '@/application';
import type { Subject } from '@/application/viewmodels';

/**
 * Hook customizado para lógica do Dashboard
 * Separa lógica de negócio da apresentação (Clean Architecture)
 */
export function useDashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const subjectService = ApplicationServiceFactory.createSubjectService();
      const allSubjects = await subjectService.findAll();
      setSubjects(allSubjects);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar disciplinas');
      console.error('Erro ao carregar disciplinas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const stats = {
    totalSubjects: subjects.length,
    totalUnits: subjects.reduce((acc) => acc + 0, 0), // TODO: Calcular unidades reais
    totalPlans: subjects.reduce((acc) => acc + 0, 0), // TODO: Calcular planos reais
  };

  return {
    subjects,
    loading,
    error,
    stats,
    reload: loadSubjects,
  };
}
