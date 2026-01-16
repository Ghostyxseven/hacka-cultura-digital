// src/application/usecases/GetReusableQuizQuestionsUseCase.ts
import { ReusableQuizQuestion } from '../../core/entities/ReusableQuizQuestion';
import { IReusableQuizQuestionRepository } from '../../core/repositories/IReusableQuizQuestionRepository';

/**
 * Caso de uso: Buscar questões reutilizáveis
 * Permite buscar questões salvas com filtros
 */
export interface GetReusableQuizQuestionsRequest {
  subject?: string;
  gradeYear?: string;
  difficulty?: 'facil' | 'medio' | 'dificil';
  tags?: string[];
  createdBy?: string;
}

export class GetReusableQuizQuestionsUseCase {
  constructor(private repository: IReusableQuizQuestionRepository) {}

  /**
   * Busca questões reutilizáveis com filtros opcionais
   */
  execute(request: GetReusableQuizQuestionsRequest = {}): ReusableQuizQuestion[] {
    if (Object.keys(request).length === 0) {
      // Se não há filtros, retorna todas
      return this.repository.getAll();
    }

    // Aplica filtros
    return this.repository.findByFilters({
      subject: request.subject,
      gradeYear: request.gradeYear,
      difficulty: request.difficulty,
      tags: request.tags,
      createdBy: request.createdBy,
    });
  }
}
