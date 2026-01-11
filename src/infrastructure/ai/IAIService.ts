// src/infrastructure/ai/IAIService.ts
import { LessonPlan } from "../../core/entities/LessonPlan";

/**
 * Interface que define o contrato para serviços de IA generativa.
 * Permite trocar o provedor de IA sem alterar o código das camadas superiores.
 * Segue o princípio de Inversão de Dependência da Clean Architecture.
 */
export interface IAIService {
  /**
   * Gera um plano de aula completo baseado nos parâmetros fornecidos.
   * 
   * @param subject - Nome da disciplina (ex: "Matemática", "História")
   * @param topic - Tema/tópico da aula (ex: "Equações do 2º grau")
   * @param grade - Ano/série escolar (ex: "8º Ano", "1º Ano EM")
   * @returns Promise com o plano de aula completo e validado
   * @throws Error se a geração falhar ou os dados retornados forem inválidos
   */
  generate(subject: string, topic: string, grade: string): Promise<LessonPlan>;
}
