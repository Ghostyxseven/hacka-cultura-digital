// src/application/usecases/RefineLessonPlanUseCase.ts
import { IAIService } from '../../core/interfaces/services/IAIService';
import { ILessonRepository } from '../../core/repositories/ILessonRepository';
import { LessonPlan } from '../../core/entities/LessonPlan';

export class RefineLessonPlanUseCase {
    constructor(
        private aiService: IAIService,
        private lessonRepository: ILessonRepository
    ) { }

    async execute(lessonPlanId: string, command: string): Promise<LessonPlan> {
        const existingPlan = this.lessonRepository.getLessonPlanById(lessonPlanId);
        if (!existingPlan) {
            throw new Error(`Plano de aula com ID ${lessonPlanId} não encontrado.`);
        }

        const refinedPlan = await this.aiService.refinePlan(existingPlan, command);

        // Mantém o ID original para atualizar o registro
        const planToSave = {
            ...refinedPlan,
            id: lessonPlanId
        };

        this.lessonRepository.saveLessonPlan(planToSave);
        return planToSave;
    }
}
