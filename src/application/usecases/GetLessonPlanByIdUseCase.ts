// src/application/usecases/GetLessonPlanByIdUseCase.ts
import { LessonPlan } from "../../core/entities/LessonPlan";
import { ILessonRepository } from "../../repository/ILessonRepository";

/**
 * Caso de uso: Busca de Plano de Aula por ID
 * RF04/05 - Geração de Materiais
 * 
 * Retorna um plano de aula específico pelo seu ID.
 */
export class GetLessonPlanByIdUseCase {
  constructor(private repository: ILessonRepository) {}

  /**
   * Busca um plano de aula pelo ID
   * 
   * @param id - ID do plano de aula
   * @returns O plano de aula encontrado ou undefined se não existir
   * @throws Error se o ID não for fornecido
   */
  execute(id: string): LessonPlan | undefined {
    if (!id || id.trim().length === 0) {
      throw new Error("ID do plano de aula é obrigatório");
    }

    return this.repository.getLessonPlanById(id);
  }
}
