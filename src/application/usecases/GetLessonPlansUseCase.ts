// src/application/usecases/GetLessonPlansUseCase.ts
import { LessonPlan } from "../../core/entities/LessonPlan";
import { ILessonRepository } from "../../core/repositories/ILessonRepository";

/**
 * Caso de uso: Listagem de Planos de Aula
 * RF04/05 - Geração de Materiais
 * 
 * Retorna os planos de aula cadastrados, com opções de filtro.
 */
export class GetLessonPlansUseCase {
  constructor(private repository: ILessonRepository) {}

  /**
   * Retorna todos os planos de aula, opcionalmente filtrados
   * 
   * @param filters - Filtros opcionais (por disciplina, ano, etc)
   * @returns Array com os planos de aula, ordenados por data de criação (mais recentes primeiro)
   */
  execute(filters?: {
    subjectId?: string;
    subjectName?: string;
    gradeYear?: string;
  }): LessonPlan[] {
    let plans = this.repository.getAllLessonPlans();

    // Aplica filtros se fornecidos
    if (filters) {
      if (filters.subjectId) {
        plans = plans.filter((p) => p.subject === filters.subjectId);
      }

      if (filters.subjectName) {
        plans = plans.filter(
          (p) => p.subject.toLowerCase() === filters.subjectName!.toLowerCase()
        );
      }

      if (filters.gradeYear) {
        plans = plans.filter((p) => p.gradeYear === filters.gradeYear);
      }
    }

    // Ordena por data de criação (mais recentes primeiro)
    return plans.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  }
}
