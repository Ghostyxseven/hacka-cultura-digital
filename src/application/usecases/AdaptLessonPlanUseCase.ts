// src/application/usecases/AdaptLessonPlanUseCase.ts
import { LessonPlan } from '../../core/entities/LessonPlan';
import { SharedLessonPlan } from '../../core/entities/SharedLessonPlan';
import { ISharedLessonPlanRepository } from '../../core/repositories/ISharedLessonPlanRepository';
import { ILessonRepository } from '../../core/repositories/ILessonRepository';

/**
 * Caso de uso: Adaptar plano de aula compartilhado
 * Permite copiar e adaptar planos compartilhados por outros professores
 */
export interface AdaptLessonPlanRequest {
  sharedPlanId: string;
  adaptedBy: string; // ID do professor que está adaptando
  changes?: string; // Descrição das mudanças feitas
}

export class AdaptLessonPlanUseCase {
  constructor(
    private sharedPlanRepository: ISharedLessonPlanRepository,
    private lessonRepository: ILessonRepository
  ) {}

  /**
   * Adapta um plano compartilhado, criando uma cópia que pode ser modificada
   */
  execute(request: AdaptLessonPlanRequest): LessonPlan {
    if (!request.sharedPlanId) {
      throw new Error('ID do plano compartilhado é obrigatório');
    }

    if (!request.adaptedBy) {
      throw new Error('ID do professor é obrigatório');
    }

    // Busca o plano compartilhado
    const sharedPlan = this.sharedPlanRepository.getById(request.sharedPlanId);

    if (!sharedPlan) {
      throw new Error('Plano compartilhado não encontrado');
    }

    // Verifica se permite adaptação
    if (!sharedPlan.allowAdaptation) {
      throw new Error('Este plano não permite adaptação');
    }

    // Verifica visibilidade
    if (sharedPlan.visibility === 'private' && sharedPlan.sharedBy !== request.adaptedBy) {
      throw new Error('Este plano é privado e não pode ser adaptado');
    }

    // Cria uma cópia do plano original
    const adaptedPlan: LessonPlan = {
      ...sharedPlan.originalPlan,
      id: `lesson-plan-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      // Remove unitId para que seja um plano independente
      unitId: undefined,
      metadata: {
        ...sharedPlan.originalPlan.metadata,
        promptVersion: `${sharedPlan.originalPlan.metadata.promptVersion}-adapted`,
      },
      createdAt: new Date(),
    };

    // Salva o plano adaptado
    this.lessonRepository.saveLessonPlan(adaptedPlan);

    // Registra a adaptação
    this.sharedPlanRepository.addAdaptation(request.sharedPlanId, {
      id: `adaptation-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      adaptedBy: request.adaptedBy,
      adaptedAt: new Date(),
      changes: request.changes || 'Plano adaptado',
      adaptedPlanId: adaptedPlan.id,
    });

    // Incrementa contador de adaptações
    this.sharedPlanRepository.incrementAdaptationCount(request.sharedPlanId);

    return adaptedPlan;
  }
}
