// src/application/usecases/DeleteSubjectUseCase.ts
import { ILessonRepository } from "../../repository/ILessonRepository";

/**
 * Caso de uso: Exclusão de Disciplina
 * RF01 - Gestão de Disciplinas
 * 
 * Remove uma disciplina do sistema.
 */
export class DeleteSubjectUseCase {
  constructor(private repository: ILessonRepository) {}

  /**
   * Remove uma disciplina pelo ID
   * 
   * @param id - ID da disciplina a ser removida
   * @throws Error se o ID não for fornecido ou a disciplina não existir
   */
  execute(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error("ID da disciplina é obrigatório");
    }

    // Verifica se a disciplina existe
    const subjects = this.repository.getAllSubjects();
    const subject = subjects.find((s) => s.id === id);

    if (!subject) {
      throw new Error(`Disciplina com ID "${id}" não encontrada`);
    }

    // Remove a disciplina
    this.repository.deleteSubject(id);
  }
}
