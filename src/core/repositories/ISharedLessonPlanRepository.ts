// src/core/repositories/ISharedLessonPlanRepository.ts
import { SharedLessonPlan } from '../entities/SharedLessonPlan';

/**
 * Interface para repositório de planos de aula compartilhados
 */
export interface ISharedLessonPlanRepository {
  /**
   * Salva um plano compartilhado
   */
  save(sharedPlan: SharedLessonPlan): void;

  /**
   * Busca todos os planos compartilhados
   */
  getAll(): SharedLessonPlan[];

  /**
   * Busca um plano compartilhado por ID
   */
  getById(id: string): SharedLessonPlan | undefined;

  /**
   * Busca planos públicos (visibilidade pública)
   */
  getPublicPlans(): SharedLessonPlan[];

  /**
   * Busca planos compartilhados por um professor
   */
  getByProfessor(professorId: string): SharedLessonPlan[];

  /**
   * Busca planos por filtros (tags, disciplina, etc.)
   */
  findByFilters(filters: {
    tags?: string[];
    subject?: string;
    gradeYear?: string;
    sharedBy?: string;
  }): SharedLessonPlan[];

  /**
   * Incrementa o contador de visualizações
   */
  incrementViewCount(id: string): void;

  /**
   * Incrementa o contador de adaptações
   */
  incrementAdaptationCount(id: string): void;

  /**
   * Adiciona uma adaptação ao histórico
   */
  addAdaptation(id: string, adaptation: SharedLessonPlan['adaptations'][0]): void;

  /**
   * Incrementa o contador de likes
   */
  incrementLikes(id: string): void;

  /**
   * Exclui um plano compartilhado
   */
  delete(id: string): void;
}
