// src/core/repositories/IAchievementRepository.ts
import { Achievement, AchievementProgress } from '../entities/Achievement';

/**
 * Interface para repositório de conquistas
 */
export interface IAchievementRepository {
  /**
   * Salva uma conquista
   */
  save(achievement: Achievement): void;

  /**
   * Busca todas as conquistas
   */
  getAll(): Achievement[];

  /**
   * Busca uma conquista por ID
   */
  getById(id: string): Achievement | undefined;

  /**
   * Busca conquistas por categoria
   */
  findByCategory(category: Achievement['category']): Achievement[];

  /**
   * Salva o progresso de um aluno em uma conquista
   */
  saveProgress(progress: AchievementProgress): void;

  /**
   * Busca o progresso de um aluno em todas as conquistas
   */
  getProgressByUser(userId: string): AchievementProgress[];

  /**
   * Busca o progresso de um aluno em uma conquista específica
   */
  getProgress(userId: string, achievementId: string): AchievementProgress | undefined;

  /**
   * Busca conquistas desbloqueadas por um usuário
   */
  getUnlockedByUser(userId: string): Achievement[];

  /**
   * Exclui uma conquista
   */
  delete(id: string): void;
}
