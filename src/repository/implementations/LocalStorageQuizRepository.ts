// src/repository/implementations/LocalStorageQuizRepository.ts
import { QuizResult } from '@/core/entities/QuizResult';
import { IQuizRepository } from '@/core/repositories/IQuizRepository';
import { StorageKeys } from '@/core/constants/StorageKeys';
import { parseJSONWithDates } from '@/utils/dateUtils';

/**
 * Implementação do repositório de quiz usando LocalStorage
 * Segue o padrão Singleton
 */
export class LocalStorageQuizRepository implements IQuizRepository {
  private static instance: LocalStorageQuizRepository;

  private constructor() {}

  public static getInstance(): LocalStorageQuizRepository {
    if (!LocalStorageQuizRepository.instance) {
      LocalStorageQuizRepository.instance = new LocalStorageQuizRepository();
    }
    return LocalStorageQuizRepository.instance;
  }

  saveQuizResult(result: QuizResult): void {
    const results = this.getAllQuizResults();
    const index = results.findIndex(r => r.id === result.id);
    index >= 0 ? (results[index] = result) : results.push(result);
    localStorage.setItem(StorageKeys.QUIZ_RESULTS, JSON.stringify(results));
  }

  getQuizResultById(id: string): QuizResult | undefined {
    const results = this.getAllQuizResults();
    return results.find(r => r.id === id);
  }

  getQuizResultsByLessonPlanId(lessonPlanId: string): QuizResult[] {
    const results = this.getAllQuizResults();
    return results.filter(r => r.lessonPlanId === lessonPlanId);
  }

  getQuizResultsByUserId(userId: string): QuizResult[] {
    const results = this.getAllQuizResults();
    return results.filter(r => r.userId === userId);
  }

  deleteQuizResult(id: string): void {
    const results = this.getAllQuizResults().filter(r => r.id !== id);
    localStorage.setItem(StorageKeys.QUIZ_RESULTS, JSON.stringify(results));
  }

  private getAllQuizResults(): QuizResult[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(StorageKeys.QUIZ_RESULTS);
    return parseJSONWithDates<QuizResult>(data);
  }
}
