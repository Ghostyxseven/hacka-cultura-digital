// src/core/interfaces/services/IPDFGeneratorService.ts
import { LessonPlan } from '@/core/entities/LessonPlan';

/**
 * Interface para serviços de geração de PDF
 * Permite diferentes implementações (react-pdf, puppeteer, etc)
 */
export interface IPDFGeneratorService {
  /**
   * Gera um PDF de prova baseado no plano de aula
   * @param lessonPlan Plano de aula com as questões
   * @param options Opções de customização
   * @returns Buffer do PDF gerado
   */
  generateProvaPDF(
    lessonPlan: LessonPlan,
    options?: ProvaPDFOptions
  ): Promise<Buffer>;

  /**
   * Gera um PDF de slides baseado no plano de aula
   * @param lessonPlan Plano de aula
   * @param options Opções de customização
   * @returns Buffer do PDF gerado
   */
  generateSlidesPDF(
    lessonPlan: LessonPlan,
    options?: SlidesPDFOptions
  ): Promise<Buffer>;
}

export interface ProvaPDFOptions {
  schoolName?: string;
  studentName?: string;
  includeAnswers?: boolean; // Se true, inclui as respostas corretas
  customHeader?: string;
}

export interface SlidesPDFOptions {
  schoolName?: string;
  includeQuiz?: boolean; // Se true, inclui slide com quiz
  theme?: 'light' | 'dark';
}
