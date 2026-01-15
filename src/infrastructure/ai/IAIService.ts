import { LessonPlan, SupportMaterial } from "../../core/entities/LessonPlan";
import { QuizResult } from "../../core/entities/QuizResult";

/**
 * Interface que define o contrato para serviços de IA generativa.
 * Permite trocar o provedor de IA sem alterar o código das camadas superiores.
 * Segue o princípio de Inversão de Dependência da Clean Architecture.
 */
export interface IAIService {
  /**
   * Gera um plano de aula completo baseado nos parâmetros fornecidos.
   */
  generate(subject: string, topic: string, grade: string, context?: string): Promise<LessonPlan>;

  /**
   * Analisa o desempenho de um aluno em um quiz e gera feedback pedagógico.
   * 
   * @param result - O resultado do quiz a ser analisado
   * @param lessonPlan - O plano de aula original para contexto
   * @returns Promise com o comentário pedagógico da IA
   */
  analyzePerformance(result: QuizResult, lessonPlan: LessonPlan): Promise<string>;

  /**
   * Gera materiais de apoio extras para uma unidade/plano de aula
   */
  generateSupportMaterials(lessonPlan: LessonPlan): Promise<SupportMaterial[]>;

  /**
   * Faz uma pergunta genérica à IA (utilizado pelo Tutor Chat)
   */
  ask(prompt: string): Promise<string>;
}
