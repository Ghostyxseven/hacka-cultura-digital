import { LessonPlan } from '@/core/entities/LessonPlan';
import { Activity } from '@/core/entities/Activity';
import type { Slide } from '@/application/viewmodels';
import {
  GenerateLessonPlanUseCase,
  GenerateActivityUseCase,
  GetLessonPlanByUnitUseCase,
  GetActivityByUnitUseCase,
  GenerateSlidesUseCase,
} from '../usecases';
import { GenerateLessonPlanDTO, GenerateActivityDTO } from '../dto';
import { ILessonPlanRepository } from '@/repository/interfaces/ILessonPlanRepository';
import { IActivityRepository } from '@/repository/interfaces/IActivityRepository';

/**
 * Serviço de aplicação: Geração de materiais didáticos via IA
 * Orquestra os casos de uso relacionados à geração de planos e atividades
 */
export class MaterialGenerationService {
  constructor(
    private readonly generateLessonPlanUseCase: GenerateLessonPlanUseCase,
    private readonly generateActivityUseCase: GenerateActivityUseCase,
    private readonly getLessonPlanByUnitUseCase: GetLessonPlanByUnitUseCase,
    private readonly getActivityByUnitUseCase: GetActivityByUnitUseCase,
    private readonly generateSlidesUseCase: GenerateSlidesUseCase,
    private readonly lessonPlanRepository: ILessonPlanRepository,
    private readonly activityRepository: IActivityRepository
  ) {}

  /**
   * Gera um plano de aula via IA
   */
  async generateLessonPlan(dto: GenerateLessonPlanDTO): Promise<LessonPlan> {
    return this.generateLessonPlanUseCase.execute(dto);
  }

  /**
   * Gera uma atividade avaliativa via IA
   */
  async generateActivity(dto: GenerateActivityDTO): Promise<Activity> {
    return this.generateActivityUseCase.execute(dto);
  }

  /**
   * Busca o plano de aula de uma unidade
   */
  async getLessonPlanByUnit(unitId: string): Promise<LessonPlan> {
    return this.getLessonPlanByUnitUseCase.execute(unitId);
  }

  /**
   * Busca a atividade avaliativa de uma unidade
   */
  async getActivityByUnit(unitId: string): Promise<Activity> {
    return this.getActivityByUnitUseCase.execute(unitId);
  }

  /**
   * Gera plano de aula e atividade avaliativa para uma unidade
   */
  async generateAllMaterials(dto: GenerateLessonPlanDTO): Promise<{
    lessonPlan: LessonPlan;
    activity: Activity;
  }> {
    // Gera o plano de aula
    const lessonPlan = await this.generateLessonPlan(dto);

    // Gera a atividade avaliativa usando o mesmo DTO
    const activity = await this.generateActivity({
      unitId: dto.unitId,
      year: dto.year,
      additionalContext: dto.additionalContext,
    });

    return {
      lessonPlan,
      activity,
    };
  }

  /**
   * Gera slides de apresentação para uma unidade
   * Requer que o plano de aula já tenha sido gerado
   */
  async generateSlides(unitId: string, year?: string, additionalContext?: string): Promise<Slide[]> {
    return this.generateSlidesUseCase.execute({
      unitId,
      year,
      additionalContext,
    });
  }

  /**
   * Arquivar um plano de aula
   */
  async archiveLessonPlan(id: string): Promise<LessonPlan> {
    return this.lessonPlanRepository.update(id, {
      archived: true,
      archivedAt: new Date().toISOString(),
    });
  }

  /**
   * Arquivar uma atividade
   */
  async archiveActivity(id: string): Promise<Activity> {
    return this.activityRepository.update(id, {
      archived: true,
      archivedAt: new Date().toISOString(),
    });
  }

  /**
   * Desarquivar um plano de aula
   */
  async unarchiveLessonPlan(id: string): Promise<LessonPlan> {
    return this.lessonPlanRepository.update(id, {
      archived: false,
      archivedAt: undefined,
    });
  }

  /**
   * Desarquivar uma atividade
   */
  async unarchiveActivity(id: string): Promise<Activity> {
    return this.activityRepository.update(id, {
      archived: false,
      archivedAt: undefined,
    });
  }

  /**
   * Buscar todos os planos de aula (incluindo arquivados)
   */
  async findAllLessonPlansIncludingArchived(): Promise<LessonPlan[]> {
    return this.lessonPlanRepository.findAll();
  }

  /**
   * Buscar todas as atividades (incluindo arquivadas)
   */
  async findAllActivitiesIncludingArchived(): Promise<Activity[]> {
    return this.activityRepository.findAll();
  }

  /**
   * Deletar permanentemente um plano de aula
   */
  async deleteLessonPlan(id: string): Promise<void> {
    return this.lessonPlanRepository.delete(id);
  }

  /**
   * Deletar permanentemente uma atividade
   */
  async deleteActivity(id: string): Promise<void> {
    return this.activityRepository.delete(id);
  }
}
