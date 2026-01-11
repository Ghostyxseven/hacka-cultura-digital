// src/application/usecases/CreateSubjectUseCase.ts
import { Subject } from "../../core/entities/Subject";
import { ILessonRepository } from "../../repository/ILessonRepository";

/**
 * Caso de uso: Criação de Disciplina
 * RF01 - Gestão de Disciplinas
 * 
 * Cria uma nova disciplina no sistema, validando os dados de entrada
 * e garantindo que não haja duplicatas.
 */
export class CreateSubjectUseCase {
  constructor(private repository: ILessonRepository) {}

  /**
   * Cria uma nova disciplina
   * 
   * @param name - Nome da disciplina (ex: "Matemática", "História")
   * @param description - Descrição opcional da disciplina
   * @param color - Cor opcional para UI (ex: "blue-500")
   * @param icon - Ícone opcional (ex: "book", "monitor")
   * @returns A disciplina criada
   * @throws Error se o nome for inválido ou já existir uma disciplina com o mesmo nome
   */
  async execute(
    name: string,
    description?: string,
    color?: string,
    icon?: string
  ): Promise<Subject> {
    // Validações
    if (!name || name.trim().length === 0) {
      throw new Error("Nome da disciplina é obrigatório");
    }

    const trimmedName = name.trim();

    // Verifica se já existe disciplina com o mesmo nome
    const existingSubjects = this.repository.getAllSubjects();
    const duplicate = existingSubjects.find(
      (s) => s.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (duplicate) {
      throw new Error(`Já existe uma disciplina com o nome "${trimmedName}"`);
    }

    // Cria a nova disciplina
    const subject: Subject = {
      id: `subject-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      name: trimmedName,
      description: description?.trim(),
      color: color?.trim(),
      icon: icon?.trim(),
      createdAt: new Date(),
    };

    // Salva no repositório
    this.repository.saveSubject(subject);

    return subject;
  }
}
