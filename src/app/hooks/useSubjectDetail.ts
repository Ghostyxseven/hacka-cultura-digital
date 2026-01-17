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
  const [archivedUnits, setArchivedUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const subjectService = ApplicationServiceFactory.createSubjectService();
      const unitService = ApplicationServiceFactory.createUnitService();

      const subjectData = await subjectService.findById(subjectId);
      const unitsData = await unitService.findBySubject(subjectId);
      
      // Busca unidades arquivadas usando o Service
      const unitService = ApplicationServiceFactory.createUnitService();
      const allUnits = await unitService.findAllIncludingArchived();
      const archivedData = allUnits.filter(
        (u) => u.subjectId === subjectId && u.archived === true
      );

      setSubject(subjectData);
      setUnits(unitsData);
      setArchivedUnits(archivedData);
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

  const archiveSubject = useCallback(async () => {
    try {
      const subjectService = ApplicationServiceFactory.createSubjectService();
      await subjectService.archive(subjectId);
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao arquivar disciplina');
      return false;
    }
  }, [subjectId]);

  const archiveUnit = useCallback(async (unitId: string) => {
    try {
      const unitService = ApplicationServiceFactory.createUnitService();
      await unitService.archive(unitId);
      await loadData(); // Recarrega dados
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao arquivar unidade');
      return false;
    }
  }, [loadData]);

  const unarchiveUnit = useCallback(async (unitId: string) => {
    try {
      const unitService = ApplicationServiceFactory.createUnitService();
      await unitService.unarchive(unitId);
      await loadData(); // Recarrega dados
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao desarquivar unidade');
      return false;
    }
  }, [loadData]);

  return {
    subject,
    units,
    archivedUnits,
    loading,
    error,
    reload: loadData,
    deleteSubject,
    archiveSubject,
    archiveUnit,
    unarchiveUnit,
  };
}
