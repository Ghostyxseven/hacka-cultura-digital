// src/application/usecases/GenerateSlidesPDFUseCase.ts
import { LessonPlan } from '@/core/entities/LessonPlan';
import { ILessonRepository } from '@/core/repositories/ILessonRepository';
import { IPDFGeneratorService, SlidesPDFOptions } from '@/core/interfaces/services/IPDFGeneratorService';

/**
 * Use Case para gerar PDF de slides
 */
export class GenerateSlidesPDFUseCase {
  constructor(
    private lessonRepository: ILessonRepository,
    private pdfGenerator: IPDFGeneratorService
  ) { }

  async execute(
    lessonPlanId: string,
    options: SlidesPDFOptions = {}
  ): Promise<Buffer> {
    if (!lessonPlanId) {
      throw new Error('lessonPlanId é obrigatório');
    }

    const lessonPlan = this.lessonRepository.getLessonPlanById(lessonPlanId);
    if (!lessonPlan) {
      throw new Error('Plano de aula não encontrado');
    }

    return await this.pdfGenerator.generateSlidesPDF(lessonPlan, options);
  }
}
