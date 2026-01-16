// src/core/repositories/IQuizRepository.ts
import { QuizResult } from '../entities/QuizResult';

/**
 * Interface do repositório para gerenciar resultados de quiz
 * Segue o padrão de Clean Architecture
 */
export interface IQuizRepository {
  saveQuizResult(result: QuizResult): void;
  getQuizResultById(id: string): QuizResult | undefined;
  getQuizResultsByLessonPlanId(lessonPlanId: string): QuizResult[];
  getQuizResultsByUserId(userId: string): QuizResult[];
  deleteQuizResult(id: string): void;
}
