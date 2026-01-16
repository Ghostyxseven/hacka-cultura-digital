// src/application/usecases/GetUnitsUseCase.ts
import { Unit } from "../../core/entities/Unit";
import { ILessonRepository } from "../../core/repositories/ILessonRepository";

/**
 * Caso de uso: Listagem de Unidades de Ensino
 * 
 * Retorna unidades de ensino, opcionalmente filtradas por disciplina.
 */
export class GetUnitsUseCase {
  constructor(private repository: ILessonRepository) {}

  /**
   * Retorna todas as unidades ou filtradas por disciplina
   * 
   * @param subjectId - ID da disciplina (opcional)
   * @returns Array com as unidades, ordenadas por data de criação
   */
  execute(subjectId?: string): Unit[] {
    let units: Unit[];

    if (subjectId) {
      units = this.repository.getUnitsBySubjectId(subjectId);
    } else {
      units = this.repository.getAllUnits();
    }

    // Ordena por data de criação (mais recentes primeiro)
    return units.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  }
}
