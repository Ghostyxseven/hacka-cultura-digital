import { Activity } from '@/core/entities/Activity';
import { IActivityRepository } from '@/repository/interfaces/IActivityRepository';
import { IUnitRepository } from '@/repository/interfaces/IUnitRepository';

/**
 * Caso de uso: Buscar atividade avaliativa por unidade
 * Responsabilidade única: Recuperar a atividade avaliativa de uma unidade
 */
export class GetActivityByUnitUseCase {
  constructor(
    private readonly activityRepository: IActivityRepository,
    private readonly unitRepository: IUnitRepository
  ) {}

  async execute(unitId: string): Promise<Activity> {
    // Valida se a unidade existe
    const unit = await this.unitRepository.findById(unitId);
    if (!unit) {
      throw new Error('Unidade não encontrada');
    }

    // Busca a atividade
    const activity = await this.activityRepository.findByUnitId(unitId);
    if (!activity) {
      throw new Error('Atividade avaliativa não encontrada para esta unidade');
    }

    return activity;
  }
}
