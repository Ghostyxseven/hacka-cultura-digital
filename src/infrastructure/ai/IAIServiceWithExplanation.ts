// src/core/interfaces/services/IAIServiceWithExplanation.ts
import { LessonPlan } from '../../core/entities/LessonPlan';
import { AIExplanation } from './ExplainabilityService';

/**
 * Resultado da geração com explicação
 */
export interface GenerationResult {
  lessonPlan: LessonPlan;
  explanation: AIExplanation;
}

/**
 * Interface estendida do IAIService com suporte a explicabilidade
 */
export interface IAIServiceWithExplanation {
  /**
   * Gera um plano de aula e retorna com explicação
   */
  generateWithExplanation(
    subject: string,
    topic: string,
    grade: string,
    context?: string
  ): Promise<GenerationResult>;

  /**
   * Busca explicação de um plano já gerado
   */
  getExplanation(lessonPlanId: string): AIExplanation | undefined;
}
