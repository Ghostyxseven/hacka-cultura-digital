// src/core/repositories/IReusableQuizQuestionRepository.ts
import { ReusableQuizQuestion } from '../entities/ReusableQuizQuestion';

/**
 * Interface para repositório de questões de quiz reutilizáveis
 */
export interface IReusableQuizQuestionRepository {
  /**
   * Salva uma questão reutilizável
   */
  save(question: ReusableQuizQuestion): void;

  /**
   * Busca todas as questões
   */
  getAll(): ReusableQuizQuestion[];

  /**
   * Busca uma questão por ID
   */
  getById(id: string): ReusableQuizQuestion | undefined;

  /**
   * Busca questões por filtros
   */
  findByFilters(filters: {
    subject?: string;
    gradeYear?: string;
    difficulty?: 'facil' | 'medio' | 'dificil';
    tags?: string[];
    createdBy?: string;
  }): ReusableQuizQuestion[];

  /**
   * Busca questões por tags
   */
  findByTags(tags: string[]): ReusableQuizQuestion[];

  /**
   * Exclui uma questão
   */
  delete(id: string): void;

  /**
   * Incrementa o contador de uso de uma questão
   */
  incrementUsage(id: string): void;
}
