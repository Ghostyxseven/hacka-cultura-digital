// src/application/usecases/CreateUnitUseCase.ts
import { Unit } from "../../core/entities/Unit";
import { SchoolYear } from "../../core/entities/LessonPlan";
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
    // Validações de ID da disciplina
    if (!subjectId || subjectId.trim().length === 0) {
      throw new Error("ID da disciplina é obrigatório");
    }

    // Validações de tema
    if (!topic || topic.trim().length === 0) {
      throw new Error("Tema da unidade é obrigatório");
    }

    const trimmedTopic = topic.trim();

    if (trimmedTopic.length < 3) {
      throw new Error("O tema da unidade deve ter pelo menos 3 caracteres");
    }

    if (trimmedTopic.length > 200) {
      throw new Error("O tema da unidade não pode ter mais de 200 caracteres");
    }

    // Validação de descrição (se fornecida)
    if (description && description.trim().length > 1000) {
      throw new Error("A descrição não pode ter mais de 1000 caracteres");
    }

    // Validação de ano escolar
    const validSchoolYears: SchoolYear[] = [
      '6º Ano', '7º Ano', '8º Ano', '9º Ano',
      '1º Ano EM', '2º Ano EM', '3º Ano EM'
    ];
    
    if (!validSchoolYears.includes(gradeYear)) {
      throw new Error(`Ano escolar inválido: "${gradeYear}"`);
    }

    // Verifica se a disciplina existe
    const subject = this.repository.getAllSubjects().find(s => s.id === subjectId);
    if (!subject) {
      throw new Error(`Disciplina com ID "${subjectId}" não encontrada`);
    }

    // Verifica se a série/ano está associada à disciplina (se a disciplina tiver séries definidas)
    if (subject.gradeYears && subject.gradeYears.length > 0) {
      if (!subject.gradeYears.includes(gradeYear)) {
        throw new Error(
          `A série "${gradeYear}" não está associada à disciplina "${subject.name}". ` +
          `Séries disponíveis: ${subject.gradeYears.join(', ')}`
        );
      }
    }

    // Verifica se já existe uma unidade com o mesmo tema na mesma disciplina e série
    const existingUnits = this.repository.getUnitsBySubjectId(subjectId);
    const duplicate = existingUnits.find(
      (u) => u.topic.toLowerCase() === trimmedTopic.toLowerCase() && 
             u.gradeYear === gradeYear
    );

    if (duplicate) {
      throw new Error(
        `Já existe uma unidade com o tema "${trimmedTopic}" ` +
        `para a série "${gradeYear}" nesta disciplina`
      );
    }

    // Cria a unidade
    const unit: Unit = {
      id: `unit-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      subjectId: subjectId,
      gradeYear: gradeYear,
      topic: trimmedTopic,
      description: description?.trim() || undefined,
      isSuggestedByAI: false,
      createdAt: new Date()
    };

    // Salva no repositório
    this.repository.saveUnit(unit);

    return unit;
  }
}
