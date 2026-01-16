// src/application/usecases/GetSharedLessonPlansUseCase.ts
import { SharedLessonPlan } from '../../core/entities/SharedLessonPlan';
import { ISharedLessonPlanRepository } from '../../core/repositories/ISharedLessonPlanRepository';

/**
 * Caso de uso: Buscar planos compartilhados
 */
export interface GetSharedLessonPlansRequest {
  tags?: string[];
  subject?: string;
  gradeYear?: string;
  sharedBy?: string;
  publicOnly?: boolean; // Se true, retorna apenas planos públicos
}

export class GetSharedLessonPlansUseCase {
  constructor(private repository: ISharedLessonPlanRepository) {}

  /**
   * Busca planos compartilhados com filtros opcionais
   */
  execute(request: GetSharedLessonPlansRequest = {}): SharedLessonPlan[] {
    let plans: SharedLessonPlan[];

    if (request.publicOnly) {
      plans = this.repository.getPublicPlans();
    } else {
      plans = this.repository.getAll();
    }

    // Aplica filtros adicionais
    if (request.tags || request.subject || request.gradeYear || request.sharedBy) {
      plans = this.repository.findByFilters({
        tags: request.tags,
        subject: request.subject,
        gradeYear: request.gradeYear,
        sharedBy: request.sharedBy,
      });
    }

    return plans;
  }
}
