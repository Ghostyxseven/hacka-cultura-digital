import { LessonPlan } from '@/core/entities/LessonPlan';
import { ILessonPlanRepository } from '@/repository/interfaces/ILessonPlanRepository';
import { IUnitRepository } from '@/repository/interfaces/IUnitRepository';

/**
 * Caso de uso: Buscar plano de aula por unidade
 * Responsabilidade única: Recuperar o plano de aula de uma unidade
 */
export class GetLessonPlanByUnitUseCase {
  constructor(
    private readonly lessonPlanRepository: ILessonPlanRepository,
    private readonly unitRepository: IUnitRepository
  ) {}

  async execute(unitId: string): Promise<LessonPlan> {
    // Valida se a unidade existe
    const unit = await this.unitRepository.findById(unitId);
    if (!unit) {
      throw new Error('Unidade não encontrada');
    }

    // Busca o plano de aula
    const plan = await this.lessonPlanRepository.findByUnitId(unitId);
    if (!plan) {
      throw new Error('Plano de aula não encontrado para esta unidade');
    }

    return plan;
  }
}
