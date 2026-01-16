// src/application/usecases/CreateClassUseCase.ts
import { Class } from '../../core/entities/Class';
import { IClassRepository } from '../../core/repositories/IClassRepository';
import { SchoolYear } from '../../core/entities/LessonPlan';

/**
 * Caso de uso: Criação de Turma
 * 
 * Cria uma nova turma no sistema.
 */
export class CreateClassUseCase {
  constructor(private classRepository: IClassRepository) {}

  /**
   * Cria uma nova turma
   * 
   * @param name - Nome da turma (ex: "6º Ano A", "9º Ano B")
   * @param gradeYear - Série/ano escolar
   * @param schoolYear - Ano letivo (ex: "2024")
   * @returns A turma criada
   * @throws Error se os dados forem inválidos ou o nome já existir
   */
  execute(
    name: string,
    gradeYear: SchoolYear,
    schoolYear: string
  ): Class {
    // Validações
    if (!name || name.trim().length === 0) {
      throw new Error("Nome da turma é obrigatório");
    }

    if (!gradeYear) {
      throw new Error("Série/ano escolar é obrigatório");
    }

    if (!schoolYear || schoolYear.trim().length === 0) {
      throw new Error("Ano letivo é obrigatório");
    }

    // Validação de formato do ano letivo (ex: "2024", "2024/2025")
    const schoolYearRegex = /^\d{4}(\/\d{4})?$/;
    if (!schoolYearRegex.test(schoolYear)) {
      throw new Error("Ano letivo inválido. Use o formato: 2024 ou 2024/2025");
    }

    // Verifica se já existe turma com mesmo nome no mesmo ano letivo
    const existingClasses = this.classRepository.getBySchoolYear(schoolYear);
    const duplicate = existingClasses.find(
      c => c.name.toLowerCase() === name.trim().toLowerCase() && c.gradeYear === gradeYear
    );
    
    if (duplicate) {
      throw new Error(`Já existe uma turma "${name}" para ${gradeYear} no ano letivo ${schoolYear}`);
    }

    // Cria a turma
    const classEntity: Class = {
      id: `class-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      name: name.trim(),
      gradeYear,
      schoolYear: schoolYear.trim(),
      students: [],
      teachers: [],
      createdAt: new Date(),
    };

    // Salva no repositório
    this.classRepository.save(classEntity);

    return classEntity;
  }
}
