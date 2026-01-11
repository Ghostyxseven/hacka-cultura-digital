// src/application/usecases/GetUnitByIdUseCase.ts
import { Unit } from "../../core/entities/Unit";
import { ILessonRepository } from "../../repository/ILessonRepository";

/**
 * Caso de uso: Buscar Unidade por ID
 * 
 * Busca uma unidade de ensino específica pelo ID.
 */
export class GetUnitByIdUseCase {
  constructor(private repository: ILessonRepository) {}

  /**
   * Busca uma unidade pelo ID
   * 
   * @param id - ID da unidade
   * @returns A unidade encontrada ou undefined
   */
  execute(id: string): Unit | undefined {
    if (!id || id.trim().length === 0) {
      throw new Error("ID da unidade é obrigatório");
    }

    return this.repository.getUnitById(id);
  }
}
