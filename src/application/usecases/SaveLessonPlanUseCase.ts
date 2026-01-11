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

    if (!lessonPlan.id || lessonPlan.id.trim().length === 0) {
      throw new Error("Plano de aula deve ter um ID válido");
    }

    if (!lessonPlan.title || lessonPlan.title.trim().length === 0) {
      throw new Error("Título do plano de aula é obrigatório");
    }

    if (lessonPlan.title.trim().length > 200) {
      throw new Error("O título do plano de aula não pode ter mais de 200 caracteres");
    }

    if (!lessonPlan.subject || lessonPlan.subject.trim().length === 0) {
      throw new Error("Disciplina do plano de aula é obrigatória");
    }

    // Validação de objetivos
    if (!lessonPlan.objectives || !Array.isArray(lessonPlan.objectives) || lessonPlan.objectives.length === 0) {
      throw new Error("O plano de aula deve ter pelo menos um objetivo de aprendizagem");
    }

    // Validação de metodologia
    if (!lessonPlan.methodology || lessonPlan.methodology.trim().length === 0) {
      throw new Error("A metodologia do plano de aula é obrigatória");
    }

    if (lessonPlan.methodology.trim().length < 50) {
      throw new Error("A metodologia deve ter pelo menos 50 caracteres");
    }

    // Validação de quiz (se presente)
    if (lessonPlan.quiz && Array.isArray(lessonPlan.quiz)) {
      if (lessonPlan.quiz.length === 0) {
        throw new Error("O plano de aula deve ter pelo menos uma questão de quiz");
      }

      lessonPlan.quiz.forEach((question, index) => {
        if (!question.question || question.question.trim().length === 0) {
          throw new Error(`A questão ${index + 1} está sem pergunta`);
        }
        if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
          throw new Error(`A questão ${index + 1} deve ter pelo menos 2 alternativas`);
        }
        if (typeof question.correctAnswer !== 'number' || question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
          throw new Error(`A questão ${index + 1} tem uma resposta correta inválida`);
        }
      });
    }

    // Salva no repositório (o repositório deve tratar atualização vs criação)
    this.repository.saveLessonPlan(lessonPlan);

    return lessonPlan;
  }
}
