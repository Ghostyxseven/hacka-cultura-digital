import { LessonPlan } from '@/core/entities/LessonPlan';
import { Activity } from '@/core/entities/Activity';
import {
  GenerateLessonPlanUseCase,
  GenerateActivityUseCase,
  GetLessonPlanByUnitUseCase,
  GetActivityByUnitUseCase,
} from '../usecases';
import { GenerateLessonPlanDTO, GenerateActivityDTO } from '../dto';

/**
 * Serviço de aplicação: Geração de materiais didáticos via IA
 * Orquestra os casos de uso relacionados à geração de planos e atividades
 */
export class MaterialGenerationService {
  constructor(
    private readonly generateLessonPlanUseCase: GenerateLessonPlanUseCase,
    private readonly generateActivityUseCase: GenerateActivityUseCase,
    private readonly getLessonPlanByUnitUseCase: GetLessonPlanByUnitUseCase,
    private readonly getActivityByUnitUseCase: GetActivityByUnitUseCase
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
}
