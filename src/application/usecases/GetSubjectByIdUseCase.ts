// src/application/usecases/GetSubjectByIdUseCase.ts
import { Subject } from "../../core/entities/Subject";
import { ILessonRepository } from "../../repository/ILessonRepository";

/**
 * Caso de uso: Buscar Disciplina por ID
 * RF01 - Gestão de Disciplinas
 * 
 * Busca uma disciplina específica pelo ID.
 */
export class GetSubjectByIdUseCase {
  constructor(private repository: ILessonRepository) {}

  /**
   * Busca uma disciplina pelo ID
   * 
   * @param id - ID da disciplina
   * @returns A disciplina encontrada ou undefined
   */
  execute(id: string): Subject | undefined {
    if (!id || id.trim().length === 0) {
      throw new Error("ID da disciplina é obrigatório");
    }

    const subjects = this.repository.getAllSubjects();
    return subjects.find(s => s.id === id);
  }
}
