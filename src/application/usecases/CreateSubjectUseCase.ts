// src/application/usecases/CreateSubjectUseCase.ts
import { Subject } from "../../core/entities/Subject";
import { SchoolYear } from "../../core/entities/LessonPlan";
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
   * @param gradeYears - Séries/anos associados à disciplina (RF01)
   * @returns A disciplina criada
   * @throws Error se o nome for inválido ou já existir uma disciplina com o mesmo nome
   */
  async execute(
    name: string,
    description?: string,
    color?: string,
    icon?: string,
    gradeYears?: SchoolYear[]
  ): Promise<Subject> {
    // Validações de nome
    if (!name || name.trim().length === 0) {
      throw new Error("Nome da disciplina é obrigatório");
    }

    const trimmedName = name.trim();

    // Validação de tamanho do nome
    if (trimmedName.length < 3) {
      throw new Error("O nome da disciplina deve ter pelo menos 3 caracteres");
    }

    if (trimmedName.length > 100) {
      throw new Error("O nome da disciplina não pode ter mais de 100 caracteres");
    }

    // Validação de descrição (se fornecida)
    if (description && description.trim().length > 500) {
      throw new Error("A descrição não pode ter mais de 500 caracteres");
    }

    // Validação de formato de cor (deve ser formato Tailwind válido)
    if (color && color.trim().length > 0) {
      const colorPattern = /^[a-z]+-[0-9]{1,3}$/;
      if (!colorPattern.test(color.trim())) {
        throw new Error("Formato de cor inválido. Use o formato Tailwind (ex: blue-500, red-600)");
      }
    }

    // Validação de séries/anos (se fornecidos)
    if (gradeYears && gradeYears.length > 0) {
      const validSchoolYears: SchoolYear[] = [
        '6º Ano', '7º Ano', '8º Ano', '9º Ano',
        '1º Ano EM', '2º Ano EM', '3º Ano EM'
      ];
      
      const invalidYears = gradeYears.filter(year => !validSchoolYears.includes(year));
      if (invalidYears.length > 0) {
        throw new Error(`Séries/anos inválidos: ${invalidYears.join(', ')}`);
      }
    }

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
      description: description?.trim() || undefined,
      color: color?.trim() || undefined,
      icon: icon?.trim() || undefined,
      gradeYears: gradeYears && gradeYears.length > 0 ? gradeYears : undefined,
      createdAt: new Date(),
    };

    // Salva no repositório
    this.repository.saveSubject(subject);

    return subject;
  }
}
