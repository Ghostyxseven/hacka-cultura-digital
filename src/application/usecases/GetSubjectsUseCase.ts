// src/application/usecases/GetSubjectsUseCase.ts
import { Subject } from "../../core/entities/Subject";
import { ILessonRepository } from "../../repository/ILessonRepository";

/**
 * Caso de uso: Listagem de Disciplinas
 * RF01 - Gestão de Disciplinas
 * 
 * Retorna todas as disciplinas cadastradas no sistema.
 */
export class GetSubjectsUseCase {
  constructor(private repository: ILessonRepository) {}

  /**
   * Retorna todas as disciplinas cadastradas
   * 
   * @returns Array com todas as disciplinas, ordenadas por data de criação (mais recentes primeiro)
   */
  execute(): Subject[] {
    const subjects = this.repository.getAllSubjects();
    
    // Ordena por data de criação (mais recentes primeiro)
    return subjects.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  }
}
