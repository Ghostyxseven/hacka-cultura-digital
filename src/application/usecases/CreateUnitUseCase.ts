// src/application/usecases/CreateUnitUseCase.ts
import { Unit, SchoolYear } from "../../core/entities/Unit";
import { ILessonRepository } from "../../repository/ILessonRepository";

/**
 * Caso de uso: Criação Manual de Unidade de Ensino
 * RF02 - Criação manual de unidades (aulas)
 * 
 * Permite que o professor crie manualmente uma unidade de ensino
 * informando o tema da aula.
 */
export class CreateUnitUseCase {
  constructor(private repository: ILessonRepository) {}

  /**
   * Cria uma nova unidade de ensino manualmente
   * 
   * @param subjectId - ID da disciplina
   * @param gradeYear - Ano/série escolar
   * @param topic - Tema da unidade/aula
   * @param description - Descrição opcional
   * @returns A unidade criada
   * @throws Error se os parâmetros forem inválidos ou a disciplina não existir
   */
  execute(
    subjectId: string,
    gradeYear: SchoolYear,
    topic: string,
    description?: string
  ): Unit {
    // Validações
    if (!subjectId || subjectId.trim().length === 0) {
      throw new Error("ID da disciplina é obrigatório");
    }

    if (!topic || topic.trim().length === 0) {
      throw new Error("Tema da unidade é obrigatório");
    }

    // Verifica se a disciplina existe
    const subject = this.repository.getAllSubjects().find(s => s.id === subjectId);
    if (!subject) {
      throw new Error(`Disciplina com ID "${subjectId}" não encontrada`);
    }

    // Cria a unidade
    const unit: Unit = {
      id: `unit-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      subjectId: subjectId,
      gradeYear: gradeYear,
      topic: topic.trim(),
      description: description?.trim(),
      isSuggestedByAI: false,
      createdAt: new Date()
    };

    // Salva no repositório
    this.repository.saveUnit(unit);

    return unit;
  }
}
