import { useState, useEffect, useCallback } from 'react';
import { ApplicationServiceFactory } from '@/application';
import type { Subject, Unit } from '@/application/viewmodels';

/**
 * Hook customizado para lógica de detalhes da disciplina
 * Separa lógica de negócio da apresentação
 */
export function useSubjectDetail(subjectId: string) {
  const [subject, setSubject] = useState<Subject | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const subjectService = ApplicationServiceFactory.createSubjectService();
      const unitService = ApplicationServiceFactory.createUnitService();

      const [subjectData, unitsData] = await Promise.all([
        subjectService.findById(subjectId),
        unitService.findBySubject(subjectId),
      ]);

      setSubject(subjectData);
      setUnits(unitsData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados');
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    if (subjectId) {
      loadData();
    }
  }, [subjectId, loadData]);

  const deleteSubject = useCallback(async () => {
    try {
      const subjectService = ApplicationServiceFactory.createSubjectService();
      await subjectService.delete(subjectId);
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar disciplina');
      return false;
    }
  }, [subjectId]);

  return {
    subject,
    units,
    loading,
    error,
    reload: loadData,
    deleteSubject,
  };
}
