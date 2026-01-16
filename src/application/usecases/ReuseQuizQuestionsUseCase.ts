// src/application/usecases/ReuseQuizQuestionsUseCase.ts
import { QuizQuestion } from '../../core/entities/LessonPlan';
import { IReusableQuizQuestionRepository } from '../../core/repositories/IReusableQuizQuestionRepository';

/**
 * Caso de uso: Reutilizar questões salvas em um plano de aula
 * Converte questões reutilizáveis em questões de quiz e incrementa contador de uso
 */
export interface ReuseQuizQuestionsRequest {
  questionIds: string[]; // IDs das questões reutilizáveis a serem reutilizadas
}

export class ReuseQuizQuestionsUseCase {
  constructor(private repository: IReusableQuizQuestionRepository) {}

  /**
   * Reutiliza questões salvas, convertendo-as para o formato de quiz
   * e incrementando o contador de uso
   */
  execute(request: ReuseQuizQuestionsRequest): QuizQuestion[] {
    if (!request.questionIds || request.questionIds.length === 0) {
      throw new Error('É necessário fornecer pelo menos um ID de questão');
    }

    const quizQuestions: QuizQuestion[] = [];

    for (const questionId of request.questionIds) {
      const reusableQuestion = this.repository.getById(questionId);

      if (!reusableQuestion) {
        throw new Error(`Questão com ID ${questionId} não encontrada`);
      }

      // Converte para formato QuizQuestion
      const quizQuestion: QuizQuestion = {
        id: reusableQuestion.id,
        question: reusableQuestion.question,
        options: reusableQuestion.options,
        correctAnswer: reusableQuestion.correctAnswer,
        justification: reusableQuestion.justification,
      };

      quizQuestions.push(quizQuestion);

      // Incrementa contador de uso
      this.repository.incrementUsage(questionId);
    }

    return quizQuestions;
  }
}
