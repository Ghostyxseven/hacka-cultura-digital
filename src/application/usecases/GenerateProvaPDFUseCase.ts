// src/application/usecases/GenerateProvaPDFUseCase.ts
import { LessonPlan } from '@/core/entities/LessonPlan';
import { ILessonRepository } from '@/core/repositories/ILessonRepository';
import { IPDFGeneratorService, ProvaPDFOptions } from '@/core/interfaces/services/IPDFGeneratorService';

/**
 * Use Case para gerar PDF de prova
 */
export class GenerateProvaPDFUseCase {
  constructor(
    private lessonRepository: ILessonRepository,
    private pdfGenerator: IPDFGeneratorService
  ) { }

  async execute(
    lessonPlanId: string,
    options: ProvaPDFOptions = {}
  ): Promise<Buffer> {
    if (!lessonPlanId) {
      throw new Error('lessonPlanId é obrigatório');
    }

    const lessonPlan = this.lessonRepository.getLessonPlanById(lessonPlanId);
    if (!lessonPlan) {
      throw new Error('Plano de aula não encontrado');
    }

    if (!lessonPlan.quiz || lessonPlan.quiz.length === 0) {
      throw new Error('Este plano de aula não possui quiz para gerar prova');
    }

    return await this.pdfGenerator.generateProvaPDF(lessonPlan, options);
  }
}
