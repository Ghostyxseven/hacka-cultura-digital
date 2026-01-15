// src/application/usecases/GenerateSupportMaterialsUseCase.ts
import { IAIService } from '../../infrastructure/ai/IAIService';
import { ILessonPlanRepository } from '../../core/repositories/ILessonPlanRepository';
import { LessonPlan } from '../../core/entities/LessonPlan';

export interface GenerateSupportMaterialsRequest {
    lessonPlanId: string;
}

export class GenerateSupportMaterialsUseCase {
    constructor(
        private aiService: IAIService,
        private lessonRepository: ILessonPlanRepository
    ) { }

    async execute(request: GenerateSupportMaterialsRequest): Promise<LessonPlan> {
        const lessonPlan = this.lessonRepository.getLessonPlanById(request.lessonPlanId);

        if (!lessonPlan) {
            throw new Error('Plano de aula não encontrado');
        }

        // Se já tiver materiais, não gera de novo (opcional, pode ser forçado)
        if (lessonPlan.supportMaterials && lessonPlan.supportMaterials.length > 0) {
            return lessonPlan;
        }

        const supportMaterials = await this.aiService.generateSupportMaterials(lessonPlan);

        const updatedLessonPlan: LessonPlan = {
            ...lessonPlan,
            supportMaterials
        };

        this.lessonRepository.saveLessonPlan(updatedLessonPlan);

        return updatedLessonPlan;
    }
}
