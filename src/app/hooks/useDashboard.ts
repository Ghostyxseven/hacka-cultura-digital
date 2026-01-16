import { useState, useEffect, useCallback } from 'react';
import { ApplicationServiceFactory } from '@/application';
import type { Subject } from '@/application/viewmodels';

interface DashboardStats {
  totalSubjects: number;
  totalUnits: number;
  totalPlans: number;
}

interface SubjectWithStats extends Subject {
  unitsCount: number;
}

interface ArchivedStats {
  archivedUnits: number;
  archivedPlans: number;
  archivedActivities: number;
}

/**
 * Hook customizado para lógica do Dashboard
 * Separa lógica de negócio da apresentação (Clean Architecture)
 * 
 * Calcula estatísticas reais de disciplinas, unidades e planos de aula
 */
export function useDashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsWithStats, setSubjectsWithStats] = useState<SubjectWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalSubjects: 0,
    totalUnits: 0,
    totalPlans: 0,
  });
  const [archivedStats, setArchivedStats] = useState<ArchivedStats>({
    archivedUnits: 0,
    archivedPlans: 0,
    archivedActivities: 0,
  });

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Carrega disciplinas
      const subjectService = ApplicationServiceFactory.createSubjectService();
      const allSubjects = await subjectService.findAll();
      setSubjects(allSubjects);

      // Carrega unidades e planos para cada disciplina
      const unitService = ApplicationServiceFactory.createUnitService();
      const materialService = ApplicationServiceFactory.createMaterialGenerationService();
      
      // Importa repositórios para buscar arquivados
      const { LocalStorageUnitRepository } = await import('@/repository/implementations/LocalStorageUnitRepository');
      const { LocalStorageLessonPlanRepository } = await import('@/repository/implementations/LocalStorageLessonPlanRepository');
      const { LocalStorageActivityRepository } = await import('@/repository/implementations/LocalStorageActivityRepository');
      
      const unitRepository = new LocalStorageUnitRepository();
      const planRepository = new LocalStorageLessonPlanRepository();
      const activityRepository = new LocalStorageActivityRepository();
      
      let totalUnits = 0;
      let totalPlans = 0;
      const subjectsStats: SubjectWithStats[] = [];

      for (const subject of allSubjects) {
        const units = await unitService.findBySubject(subject.id);
        totalUnits += units.length;

        // Conta planos de aula para cada unidade
        let plansCount = 0;
        for (const unit of units) {
          try {
            const plan = await materialService.getLessonPlanByUnit(unit.id);
            if (plan) plansCount++;
          } catch {
            // Unidade sem plano ainda
          }
        }
        totalPlans += plansCount;

        subjectsStats.push({
          ...subject,
          unitsCount: units.length,
        });
      }

      // Conta materiais arquivados
      const allUnits = await unitRepository.findAll();
      const allPlans = await planRepository.findAll();
      const allActivities = await activityRepository.findAll();

      const archivedUnitsCount = allUnits.filter((u) => u.archived === true).length;
      const archivedPlansCount = allPlans.filter((p) => p.archived === true).length;
      const archivedActivitiesCount = allActivities.filter((a) => a.archived === true).length;

      setSubjectsWithStats(subjectsStats);
      setStats({
        totalSubjects: allSubjects.length,
        totalUnits,
        totalPlans,
      });
      setArchivedStats({
        archivedUnits: archivedUnitsCount,
        archivedPlans: archivedPlansCount,
        archivedActivities: archivedActivitiesCount,
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dashboard');
      console.error('Erro ao carregar dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    subjects,
    subjectsWithStats,
    loading,
    error,
    stats,
    reload: loadDashboard,
  };
}
