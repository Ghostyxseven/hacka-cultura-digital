// src/lib/service.ts
// Factory para criar instância do LessonPlanService
import { LessonPlanService } from '../application/services/LessonPlanService';
import { LocalStorageRepository } from '../repository/implementations/LocalStorageRepository';
import { GeminiService } from '../infrastructure/ai/GeminiService';

let serviceInstance: LessonPlanService | null = null;

/**
 * Obtém instância singleton do LessonPlanService
 */
export function getLessonPlanService(): LessonPlanService {
  if (!serviceInstance) {
    const repository = LocalStorageRepository.getInstance();
    const aiService = new GeminiService();
    serviceInstance = new LessonPlanService(repository, aiService);
  }
  return serviceInstance;
}
