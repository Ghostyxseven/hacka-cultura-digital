// src/application/usecases/GenerateLessonPlanUseCase.ts
import { LessonPlan, SchoolYear } from "../../core/entities/LessonPlan";
import { IAIService } from "../../core/interfaces/services/IAIService";

/**
 * Caso de uso: Geração de Plano de Aula via IA
 * RF04/05 - Geração automática de Planos de Aula
 * 
 * Orquestra a geração de planos de aula utilizando o serviço de IA,
 * garantindo que os dados sejam validados e estruturados corretamente.
 */
export class GenerateLessonPlanUseCase {
  constructor(private aiService: IAIService) { }

  /**
   * Gera um plano de aula completo baseado nos parâmetros fornecidos
   * 
   * @param subject - Nome da disciplina
   * @param topic - Tema/tópico da aula
   * @param grade - Ano/série escolar (deve ser um SchoolYear válido)
   * @param context - Contexto adicional para a geração do plano de aula (opcional)
   * @returns Promise com o plano de aula gerado e validado
   * @throws Error se a geração falhar ou os parâmetros forem inválidos
   */
  async execute(
    subject: string,
    topic: string,
    grade: SchoolYear,
    context?: string
  ): Promise<LessonPlan> {
    // Validações de entrada
    if (!subject || subject.trim().length === 0) {
      throw new Error("Disciplina é obrigatória");
    }

    if (!topic || topic.trim().length === 0) {
      throw new Error("Tema/tópico é obrigatório");
    }

    if (!grade) {
      throw new Error("Ano/série é obrigatório");
    }

    // Delega a geração para o serviço de IA
    // O serviço já valida o SchoolYear internamente
    const lessonPlan = await this.aiService.generate(
      subject.trim(),
      topic.trim(),
      grade,
      context
    );

    return lessonPlan;
  }
}
