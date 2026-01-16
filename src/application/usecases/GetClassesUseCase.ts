// src/application/usecases/GetClassesUseCase.ts
import { Class } from '../../core/entities/Class';
import { IClassRepository } from '../../core/repositories/IClassRepository';
import { SchoolYear } from '../../core/entities/LessonPlan';

/**
 * Caso de uso: Listar Turmas
 * 
 * Lista turmas com filtros opcionais.
 */
export class GetClassesUseCase {
  constructor(private classRepository: IClassRepository) {}

  /**
   * Lista todas as turmas ou filtra por série/ano letivo
   * 
   * @param gradeYear - Opcional: filtrar por série
   * @param schoolYear - Opcional: filtrar por ano letivo
   * @returns Lista de turmas
   */
  execute(gradeYear?: SchoolYear, schoolYear?: string): Class[] {
    let classes = this.classRepository.getAll();

    if (gradeYear) {
      classes = classes.filter(c => c.gradeYear === gradeYear);
    }

    if (schoolYear) {
      classes = classes.filter(c => c.schoolYear === schoolYear);
    }

    // Ordena por série e depois por nome
    return classes.sort((a, b) => {
      const gradeOrder: Record<SchoolYear, number> = {
        '6º Ano': 1,
        '7º Ano': 2,
        '8º Ano': 3,
        '9º Ano': 4,
        '1º Ano EM': 5,
        '2º Ano EM': 6,
        '3º Ano EM': 7,
      };

      const gradeDiff = gradeOrder[a.gradeYear] - gradeOrder[b.gradeYear];
      if (gradeDiff !== 0) return gradeDiff;

      return a.name.localeCompare(b.name);
    });
  }
}
