/**
 * Serviço de Aplicação: Arquivamento em Cascata
 * 
 * Orquestra arquivamento em cascata:
 * - Arquivar Subject → arquiva Units, Plans e Activities
 * - Desarquivar Subject → restaura Units (Plans e Activities ficam arquivados por segurança)
 * 
 * Clean Architecture: Application Layer - Serviço de Aplicação
 */

import { ISubjectRepository } from '@/repository/interfaces/ISubjectRepository';
import { IUnitRepository } from '@/repository/interfaces/IUnitRepository';
import { ILessonPlanRepository } from '@/repository/interfaces/ILessonPlanRepository';
import { IActivityRepository } from '@/repository/interfaces/IActivityRepository';

export class ArchiveService {
  constructor(
    private readonly subjectRepository: ISubjectRepository,
    private readonly unitRepository: IUnitRepository,
    private readonly lessonPlanRepository: ILessonPlanRepository,
    private readonly activityRepository: IActivityRepository
  ) {}

  /**
   * Arquivar disciplina em cascata
   * Arquivar Subject → arquiva Units, Plans e Activities
   */
  async archiveSubjectCascade(subjectId: string): Promise<void> {
    // 1. Arquivar a disciplina
    await this.subjectRepository.update(subjectId, {
      archived: true,
      archivedAt: new Date().toISOString(),
    });

    // 2. Buscar todas as unidades da disciplina
    const allUnits = await this.unitRepository.findAll();
    const subjectUnits = allUnits.filter((u) => u.subjectId === subjectId);

    // 3. Arquivar todas as unidades em paralelo
    await Promise.all(
      subjectUnits.map((unit) =>
        this.unitRepository.update(unit.id, {
          archived: true,
          archivedAt: new Date().toISOString(),
        })
      )
    );

    // 4. Buscar todos os planos de aula das unidades (incluindo arquivados)
    const allPlans = await this.lessonPlanRepository.findAll();
    const subjectPlans = allPlans.filter((p) =>
      subjectUnits.some((u) => u.id === p.unitId) && !p.archived
    );

    // 5. Arquivar todos os planos de aula em paralelo
    await Promise.all(
      subjectPlans.map((plan) =>
        this.lessonPlanRepository.update(plan.id, {
          archived: true,
          archivedAt: new Date().toISOString(),
        })
      )
    );

    // 6. Buscar todas as atividades das unidades (incluindo arquivadas)
    const allActivities = await this.activityRepository.findAll();
    const subjectActivities = allActivities.filter((a) =>
      subjectUnits.some((u) => u.id === a.unitId) && !a.archived
    );

    // 7. Arquivar todas as atividades em paralelo
    await Promise.all(
      subjectActivities.map((activity) =>
        this.activityRepository.update(activity.id, {
          archived: true,
          archivedAt: new Date().toISOString(),
        })
      )
    );
  }

  /**
   * Desarquivar disciplina (restaura apenas unidades)
   * Plans e Activities permanecem arquivados por segurança
   */
  async unarchiveSubjectCascade(subjectId: string): Promise<void> {
    // 1. Desarquivar a disciplina
    await this.subjectRepository.update(subjectId, {
      archived: false,
      archivedAt: undefined,
    });

    // 2. Buscar todas as unidades arquivadas da disciplina
    const allUnits = await this.unitRepository.findAll();
    const archivedSubjectUnits = allUnits.filter(
      (u) => u.subjectId === subjectId && u.archived === true
    );

    // 3. Desarquivar todas as unidades em paralelo
    await Promise.all(
      archivedSubjectUnits.map((unit) =>
        this.unitRepository.update(unit.id, {
          archived: false,
          archivedAt: undefined,
        })
      )
    );

    // Nota: Plans e Activities não são desarquivados automaticamente
    // O usuário deve desarquivá-los manualmente se necessário
  }

  /**
   * Arquivar unidade em cascata
   * Arquivar Unit → arquiva Plans e Activities
   */
  async archiveUnitCascade(unitId: string): Promise<void> {
    // 1. Arquivar a unidade
    await this.unitRepository.update(unitId, {
      archived: true,
      archivedAt: new Date().toISOString(),
    });

    // 2. Buscar e arquivar o plano de aula da unidade
    const lessonPlan = await this.lessonPlanRepository.findByUnitId(unitId);
    if (lessonPlan && !lessonPlan.archived) {
      await this.lessonPlanRepository.update(lessonPlan.id, {
        archived: true,
        archivedAt: new Date().toISOString(),
      });
    }

    // 3. Buscar e arquivar a atividade da unidade
    const activity = await this.activityRepository.findByUnitId(unitId);
    if (activity && !activity.archived) {
      await this.activityRepository.update(activity.id, {
        archived: true,
        archivedAt: new Date().toISOString(),
      });
    }
  }

  /**
   * Desarquivar unidade (restaura apenas a unidade)
   * Plans e Activities permanecem arquivados por segurança
   */
  async unarchiveUnitCascade(unitId: string): Promise<void> {
    // 1. Desarquivar a unidade
    await this.unitRepository.update(unitId, {
      archived: false,
      archivedAt: undefined,
    });

    // Nota: Plans e Activities não são desarquivados automaticamente
    // O usuário deve desarquivá-los manualmente se necessário
  }
}
