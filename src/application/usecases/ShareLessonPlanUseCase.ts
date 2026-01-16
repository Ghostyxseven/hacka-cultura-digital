// src/application/usecases/ShareLessonPlanUseCase.ts
import { SharedLessonPlan } from '../../core/entities/SharedLessonPlan';
import { LessonPlan } from '../../core/entities/LessonPlan';
import { ISharedLessonPlanRepository } from '../../core/repositories/ISharedLessonPlanRepository';
import { ILessonRepository } from '../../core/repositories/ILessonRepository';

/**
 * Caso de uso: Compartilhar plano de aula
 * Permite que professores compartilhem planos entre si
 */
export interface ShareLessonPlanRequest {
  lessonPlanId: string;
  sharedBy: string; // ID do professor que está compartilhando
  visibility: 'public' | 'private' | 'link';
  allowAdaptation: boolean;
  title?: string; // Título opcional para a biblioteca
  description?: string;
  tags?: string[];
}

export class ShareLessonPlanUseCase {
  constructor(
    private sharedPlanRepository: ISharedLessonPlanRepository,
    private lessonRepository: ILessonRepository
  ) {}

  /**
   * Compartilha um plano de aula
   */
  execute(request: ShareLessonPlanRequest): SharedLessonPlan {
    if (!request.lessonPlanId) {
      throw new Error('ID do plano de aula é obrigatório');
    }

    if (!request.sharedBy) {
      throw new Error('ID do professor é obrigatório');
    }

    // Busca o plano original
    const lessonPlan = this.lessonRepository.getLessonPlanById(request.lessonPlanId);

    if (!lessonPlan) {
      throw new Error('Plano de aula não encontrado');
    }

    // Verifica se já existe um compartilhamento deste plano
    const existingShared = this.sharedPlanRepository.getAll().find(
      sp => sp.lessonPlanId === request.lessonPlanId && sp.sharedBy === request.sharedBy
    );

    if (existingShared) {
      throw new Error('Este plano já foi compartilhado por você');
    }

    // Cria o compartilhamento
    const sharedPlan: SharedLessonPlan = {
      id: `shared-plan-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      lessonPlanId: request.lessonPlanId,
      originalPlan: { ...lessonPlan }, // Cópia do plano
      sharedBy: request.sharedBy,
      sharedAt: new Date(),
      visibility: request.visibility,
      allowAdaptation: request.allowAdaptation,
      title: request.title || lessonPlan.title,
      description: request.description,
      tags: request.tags || [],
      viewCount: 0,
      adaptationCount: 0,
      likes: 0,
      adaptations: [],
    };

    // Salva no repositório
    this.sharedPlanRepository.save(sharedPlan);

    return sharedPlan;
  }
}
