// src/application/usecases/SaveLessonPlanUseCase.ts
import { LessonPlan } from "../../core/entities/LessonPlan";
import { ILessonRepository } from "../../repository/ILessonRepository";

/**
 * Caso de uso: Salvamento de Plano de Aula
 * RF04/05 - Geração de Materiais
 * 
 * Salva um plano de aula no repositório, atualizando se já existir.
 */
export class SaveLessonPlanUseCase {
  constructor(private repository: ILessonRepository) {}

  /**
   * Salva ou atualiza um plano de aula
   * 
   * @param lessonPlan - Plano de aula a ser salvo
   * @returns O plano de aula salvo
   * @throws Error se o plano de aula for inválido
   */
  execute(lessonPlan: LessonPlan): LessonPlan {
    // Validações básicas
    if (!lessonPlan) {
      throw new Error("Plano de aula é obrigatório");
    }

    if (!lessonPlan.id) {
      throw new Error("Plano de aula deve ter um ID");
    }

    if (!lessonPlan.title || lessonPlan.title.trim().length === 0) {
      throw new Error("Título do plano de aula é obrigatório");
    }

    if (!lessonPlan.subject || lessonPlan.subject.trim().length === 0) {
      throw new Error("Disciplina do plano de aula é obrigatória");
    }

    // Salva no repositório (o repositório deve tratar atualização vs criação)
    this.repository.saveLessonPlan(lessonPlan);

    return lessonPlan;
  }
}
