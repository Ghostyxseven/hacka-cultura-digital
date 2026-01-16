// src/application/usecases/GetQuizResultsUseCase.ts
import { QuizResult } from '@/core/entities/QuizResult';
import { IQuizRepository } from '@/core/repositories/IQuizRepository';

/**
 * Use Case para buscar resultados de quiz
 */
export class GetQuizResultsUseCase {
  constructor(private quizRepository: IQuizRepository) {}

  getByLessonPlanId(lessonPlanId: string): QuizResult[] {
    if (!lessonPlanId) {
      throw new Error('lessonPlanId é obrigatório');
    }
    return this.quizRepository.getQuizResultsByLessonPlanId(lessonPlanId);
  }

  getByUserId(userId: string): QuizResult[] {
    if (!userId) {
      throw new Error('userId é obrigatório');
    }
    return this.quizRepository.getQuizResultsByUserId(userId);
  }

  getById(id: string): QuizResult | undefined {
    if (!id) {
      throw new Error('id é obrigatório');
    }
    return this.quizRepository.getQuizResultById(id);
  }
}
